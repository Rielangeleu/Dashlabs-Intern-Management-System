"use server";

import clientPromise from "../lib/mongodb";
import { revalidatePath } from "next/cache";

export async function createTicket(ticketData: any) {
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
      assignedSolver: ticket.assignedSolver || null, // Will say "Unassigned" in UI if null
      priority: ticket.priority || "Normal",
      status: ticket.status || "Open",
      // Format the date to match your design (e.g., "March 22, 2026")
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

export async function updateTicketStatus(ticketId: string, newStatus: string) {
  try {
    const client = await clientPromise;
    const db = client.db("intern_system");

    await db.collection("tickets").updateOne(
      { ticketId },
      { $set: { status: newStatus } }
    );

    revalidatePath(`/ticket/${ticketId}`);
    revalidatePath("/ticket-tracker");
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false };
  }
}

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

    revalidatePath(`/ticket/${ticketId}`);
    return { success: true, comment: newComment };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false };
  }
}