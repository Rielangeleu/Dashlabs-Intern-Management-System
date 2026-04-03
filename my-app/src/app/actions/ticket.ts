"use server";

import clientPromise from "../lib/mongodb";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import { logTicketHistory } from "./history"; 
import { createNotification } from "./notification";

// 1. CREATE TICKET (Audit Integrated)
export async function createTicket(ticketData: any, performedBy: string = "System") {
  try {
    const client = await clientPromise;
    const db = client.db("intern_system");

    // Use the ticketId provided from the form, or generate one if they cleared it out
    const finalTicketId = ticketData.ticketId || `DASH-${Math.floor(1000 + Math.random() * 9000)}`;

    await db.collection("tickets").insertOne({
      ...ticketData,
      ticketId: finalTicketId, // Saves the custom or edited ID
      status: "Open",
      createdAt: new Date(),
    });

    // 👇 INJECTED AUDIT LOG
    await logTicketHistory({
      ticketId: finalTicketId,
      action: "CREATED",
      performedBy: ticketData.assignedSolver || performedBy,
      details: `Ticket created for ${ticketData.laboratory || "a lab"}.`
    });

    revalidatePath("/ticket-tracker");
    return { success: true, ticketId: finalTicketId };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false };
  }
}

// ... Start Get ticket function for Ticket Tracker...

export async function getTickets() {
  try {
    const client = await clientPromise;
    const db = client.db("intern_system");

    // Fetch all tickets, sorted by newest first
    const rawTickets = await db.collection("tickets").find({}).sort({ createdAt: -1 }).toArray();

    // MongoDB returns complex objects (like ObjectIds and Dates) that Next.js Client Components can't read directly. 
    // We map them into clean, simple strings here.
    const safeTickets = rawTickets.map((ticket) => ({
      id: ticket._id.toString(),
      ticketId: ticket.ticketId || "UNKNOWN",
      laboratory: ticket.laboratory || "Unknown Lab",
      concernSummary: ticket.description || "No description provided",
      assignedSolver: ticket.assignedSolver || null, // "Unassigned" if null or if unassigned
      priority: ticket.priority || "Normal",
      status: ticket.status || "Open",
      // Format date with Month day, year e.g. March 22, 2026
      dateCreated: ticket.createdAt 
        ? new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : "Unknown date",
      lastActivity: "Just now", // Placeholder until we add an activity log
    }));

    return { success: true, tickets: safeTickets };
  } catch (error) {
    console.error("Failed to fetch tickets:", error);
    return { success: false, tickets: [] };
  }
}

// Function to Load Tickets from Ticket Tracker

export async function getTicketByTicketId(ticketId: string) {
  try {
    const client = await clientPromise;
    const db = client.db("intern_system");

    const ticket = await db.collection("tickets").findOne({ ticketId });

    if (!ticket) return { success: false, error: "Ticket not found" };

    // Clean up MongoDB _id and Date objects for the frontend
    const safeTicket = {
      ...ticket,
      _id: ticket._id.toString(),
      createdAt: ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : "Unknown",
      comments: ticket.comments || [] // Ensure comments array exists
    };

    return { success: true, ticket: safeTicket };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false };
  }
}

// 2. UPDATE TICKET STATUS (Audit Integrated)
export async function updateTicketStatus(ticketId: string, newStatus: string, performedBy: string = "System") {
  try {
    const client = await clientPromise;
    const db = client.db("intern_system");

    await db.collection("tickets").updateOne(
      { ticketId },
      { $set: { status: newStatus } }
    );

    // 👇 INJECTED AUDIT LOG
    await logTicketHistory({
      ticketId: ticketId,
      action: "STATUS_CHANGED",
      performedBy: performedBy,
      details: `Status changed to ${newStatus}.`
    });

    revalidatePath(`/ticket/${ticketId}`);
    revalidatePath("/ticket-tracker");
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false };
  }
}

// 3. ADD TICKET COMMENT (Audit Integrated)
export async function addTicketComment(ticketId: string, text: string, author: string) {
  try {
    const client = await clientPromise;
    const db = client.db("intern_system");

    const newComment = {
      id: crypto.randomUUID(),
      text,
      author,
      createdAt: new Date().toISOString()
    };

    await db.collection("tickets").updateOne(
      { ticketId },
      { $push: { comments: newComment } as any } // $push adds to the array
    );

    // 👇 INJECTED AUDIT LOG
    await logTicketHistory({
      ticketId: ticketId,
      action: "NOTE_ADDED",
      performedBy: author, // Using the author of the comment
      // Truncate the text so the history log isn't massive if they write a paragraph
      details: `Added note: "${text.length > 40 ? text.substring(0, 40) + '...' : text}"` 
    });

    revalidatePath(`/ticket/${ticketId}`);
    return { success: true, comment: newComment };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false };
  }
}

//Ticket Assignment Functions

// 1. Fetch users who are allowed to be assigned (QA and Admins)
export async function getSolvers() {
  try {
    const client = await clientPromise;
    const db = client.db("intern_system");

    // Find all users who are NOT Interns
    const solvers = await db.collection("users")
      .find({ })
      .project({ _id: 1, name: 1, role: 1 }) // Only bring back what we need
      .toArray();

    return { 
      success: true, 
      solvers: solvers.map(s => ({ id: s._id.toString(), name: s.name, role: s.role })) 
    };
  } catch (error) {
    console.error("Failed to fetch solvers:", error);
    return { success: false, solvers: [] };
  }
}

// 2. Update the assigned person on a ticket (Audit Integrated)
export async function assignTicket(ticketId: string, solverName: string, performedBy: string = "System") {
  try {
    const client = await clientPromise;
    const db = client.db("intern_system");

    await db.collection("tickets").updateOne(
      { ticketId },
      { $set: { assignedSolver: solverName } }
    );

    // 👇 INJECTED AUDIT LOG
    await logTicketHistory({
      ticketId: ticketId,
      action: "REASSIGNED",
      performedBy: performedBy,
      details: `Ticket assigned to ${solverName}.`
    });

    await createNotification(
      solverName, // The person receiving the ticket
      `You have been assigned Ticket ${ticketId} by ${performedBy}.`,
      `/ticket/${ticketId}` // The link to the ticket
    );

    revalidatePath(`/ticket/${ticketId}`);
    revalidatePath("/ticket-tracker");
    return { success: true };
  } catch (error) {
    console.error("Failed to assign ticket:", error);
    return { success: false };
  }
}

// Functions for Ticket Analytics in the Dashboard page

export async function getDashboardData(userName: string | undefined | null) {
  try {
    const client = await clientPromise;
    const db = client.db("intern_system");

    // 1. Get the aggregate counts for the summary cards
    const [openCount, inProgressCount, urgentCount] = await Promise.all([
      db.collection("tickets").countDocuments({ status: "Open" }),
      db.collection("tickets").countDocuments({ status: "In Progress" }),
      db.collection("tickets").countDocuments({ priority: "Urgent", status: { $ne: "Resolved" } })
    ]);

    // 2. Fetch up to 5 unresolved tickets assigned specifically to this user
    let assignedTickets: any[] = [];
    if (userName) {
      const rawTickets = await db.collection("tickets")
        .find({ assignedSolver: userName, status: { $ne: "Resolved" } })
        .sort({ createdAt: -1 }) // Newest first
        .limit(5)
        .toArray();

      assignedTickets = rawTickets.map(t => ({
        ticketId: t.ticketId || "UNKNOWN",
        laboratory: t.laboratory || "Unknown Lab",
        concern: t.description || "No description",
        status: t.status || "Open",
        priority: t.priority || "Normal",
        assignedSolver: t.assignedSolver || "Unassigned",
        lastActivity: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "Unknown",
      }));
    }

    return {
      success: true,
      stats: {
        open: openCount,
        inProgress: inProgressCount,
        urgent: urgentCount
      },
      pendingConcerns: assignedTickets
    };
  } catch (error) {
    console.error("Dashboard Data Error:", error);
    return { success: false, stats: { open: 0, inProgress: 0, urgent: 0 }, pendingConcerns: [] };
  }
}