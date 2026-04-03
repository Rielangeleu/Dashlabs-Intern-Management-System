"use server";

import clientPromise from "../lib/mongodb"; 

// History Log Shape based on existing action
interface HistoryLog {
  ticketId: string;
  action: "CREATED" | "STATUS_CHANGED" | "REASSIGNED" | "NOTE_ADDED";
  performedBy: string; // The user who did the action
  details: string;     // e.g., "Changed status from Open to In Progress"
}

export async function logTicketHistory({ ticketId, action, performedBy, details }: HistoryLog) {
  try {
    const client = await clientPromise;
    const db = client.db("intern_system");

    const newLog = {
      ticketId,
      action,
      performedBy,
      details,
      timestamp: new Date(),
    };

    await db.collection("ticket_history").insertOne(newLog);
    return { success: true };
    
  } catch (error) {
    console.error("Failed to log history:", error);
    return { success: false, error: "Audit trail logging failed" };
  }
}



export async function getHistoryForTicket(ticketId: string) {
  try {
    const client = await clientPromise;
    const db = client.db("intern_system");

    const history = await db
      .collection("ticket_history")
      .find({ ticketId: ticketId })
      .sort({ timestamp: -1 }) // Sort newest to oldest
      .toArray();

    // Clean up MongoDB ObjectIDs for the Next.js client
    return { 
      success: true, 
      history: history.map(log => ({ ...log, _id: log._id.toString() })) 
    };

  } catch (error) {
    console.error("Failed to fetch history:", error);
    return { success: false, history: [] };
  }
}

//view logs
// src/app/actions/history.ts

export async function getAllTaskHistory(page: number = 1, limit: number = 15) {
  try {
    const client = await clientPromise;
    const db = client.db("intern_system");

    // Math to figure out how many logs to skip
    const skip = (page - 1) * limit;

    // 1. Get the total number of logs so we know how many pages exist
    const totalCount = await db.collection("ticket_history").countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    // 2. Fetch just the specific chunk of logs for this page
    const history = await db
      .collection("ticket_history")
      .find({})
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return { 
      success: true, 
      history: history.map(log => ({ 
        ...log, 
        _id: log._id.toString(),
        timestamp: log.timestamp ? new Date(log.timestamp).toISOString() : null 
      })),
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        limit
      }
    };

  } catch (error) {
    console.error("Failed to fetch paginated history:", error);
    return { success: false, history: [], pagination: null };
  }
}