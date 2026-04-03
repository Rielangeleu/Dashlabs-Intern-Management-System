"use server";

import clientPromise from "../lib/mongodb";
import { revalidatePath } from "next/cache";
import { logTicketHistory } from "./history"; // <-- Added import for Audit Trail

// 1. Fetch tickets assigned to the user to put into the endorsement
export async function getUserTicketsForEndorsement(userName: string) {
  try {
    const client = await clientPromise;
    const db = client.db("intern_system");

    const tickets = await db.collection("tickets")
      .find({ assignedSolver: userName })
      .toArray();

    // Group them by status just like your template expects
    const completed = tickets.filter(t => t.status === "Resolved");
    const inProgress = tickets.filter(t => t.status === "In Progress");
    const pending = tickets.filter(t => ["Open", "Waiting for Info"].includes(t.status));

    return { 
      success: true, 
      tickets: {
        completed: completed.map(t => ({ id: t.ticketId, laboratory: t.laboratory, concern: t.description })),
        inProgress: inProgress.map(t => ({ id: t.ticketId, laboratory: t.laboratory, concern: t.description })),
        pending: pending.map(t => ({ id: t.ticketId, laboratory: t.laboratory, concern: t.description })),
      }
    };
  } catch (error) {
    console.error("Fetch Tickets Error:", error);
    return { success: false, tickets: { completed: [], inProgress: [], pending: [] } };
  }
}

// 2. Save the Endorsement to the Database
export async function createEndorsement(data: any) {
  try {
    const client = await clientPromise;
    const db = client.db("intern_system");

    const newEndorsement = {
      ...data,
      id: `END-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "Pending", // Always starts as Pending
      createdAt: new Date(),
    };

    await db.collection("endorsements").insertOne(newEndorsement);

    revalidatePath("/shift-logs");
    return { success: true, id: newEndorsement.id };
  } catch (error) {
    console.error("Create Endorsement Error:", error);
    return { success: false };
  }
}

// 3. Get all Endorsements with Pagination and Smart Filtering
export async function getEndorsements(
  page: number = 1, 
  limit: number = 10, 
  statusFilter: string = "active", 
  searchId: string = ""
) {
  try {
    const client = await clientPromise;
    const db = client.db("intern_system");

    const skip = (page - 1) * limit;
    let query: any = {};

    // A. Apply Search Filter (Overrides everything else)
    if (searchId) {
      query.id = { $regex: searchId, $options: "i" };
    } 
    // B. Apply Status Filters
    else {
      if (statusFilter === "pending") {
        query.status = "Pending";
      } 
      else if (statusFilter === "acknowledged") {
        query.status = "Acknowledged";
      } 
      else if (statusFilter === "active") {
        // Find exactly 24 hours ago, formatted as ISO string to match your database saves
        const oneDayAgoISO = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        
        query.$or = [
          { status: "Pending" },
          { 
            status: "Acknowledged", 
            confirmedAt: { $gte: oneDayAgoISO } 
          }
        ];
      }
    }

    // Execute paginated queries
    const totalCount = await db.collection("endorsements").countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    const rawLogs = await db.collection("endorsements")
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return { 
      success: true, 
      logs: rawLogs.map(log => ({
        _id: log._id.toString(), // Needed for React keys
        id: log.id,
        intern: log.internName,
        date: log.shiftDate,
        shift: log.shiftTime,
        time: log.shiftTimeExact,
        summary: log.notes || "No notes provided.",
        tasksCompleted: log.tickets?.completed?.length || 0,
        pendingTasks: (log.tickets?.inProgress?.length || 0) + (log.tickets?.pending?.length || 0),
        status: log.status,
      })),
      pagination: { totalCount, totalPages, currentPage: page, limit }
    };
  } catch (error) {
    console.error("Fetch Endorsements Error:", error);
    return { success: false, logs: [], pagination: null };
  }
}

// Functions for Loading Data in Endorsement Review , Allows the user to review endorsements and assign pending tasks

// 4. Fetch a single endorsement by its ID
export async function getEndorsementById(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db("intern_system");
    
    const endorsement = await db.collection("endorsements").findOne({ id });
    if (!endorsement) return { success: false };

    // Clean up the MongoDB _id for the frontend
    const safeEndorsement = {
      ...endorsement,
      _id: endorsement._id.toString(),
      createdAt: endorsement.createdAt ? new Date(endorsement.createdAt).toLocaleString() : "Unknown",
    };

    return { success: true, endorsement: safeEndorsement };
  } catch (error) {
    return { success: false };
  }
}

// 5. Update the status to "Acknowledged"
export async function acknowledgeEndorsement(id: string, userName: string) {
  try {
    const client = await clientPromise;
    const db = client.db("intern_system");

    await db.collection("endorsements").updateOne(
      { id },
      { 
        $set: { 
          status: "Acknowledged", 
          confirmedBy: userName, 
          confirmedAt: new Date().toISOString() 
        } 
      }
    );

    revalidatePath(`/endorsement-review/${id}`);
    revalidatePath("/shift-logs");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// 6. Bulk assign tickets to the new shift worker (Audit Trail Integrated)
export async function bulkAssignTickets(ticketIds: string[], newAssignee: string) {
  try {
    const client = await clientPromise;
    const db = client.db("intern_system");

    // Update all tickets in the array to the new solver
    await db.collection("tickets").updateMany(
      { ticketId: { $in: ticketIds } },
      { $set: { assignedSolver: newAssignee } }
    );

    // 👇 INJECTED BULK AUDIT LOG 👇
    await Promise.all(
      ticketIds.map((id) => 
        logTicketHistory({
          ticketId: id,
          action: "REASSIGNED",
          performedBy: newAssignee,
          details: `Accepted ticket during shift handover.`
        })
      )
    );

    revalidatePath("/ticket-tracker");
    revalidatePath("/shift-logs");
    return { success: true };
  } catch (error) {
    console.error("Bulk Assign Error:", error);
    return { success: false };
  }
}