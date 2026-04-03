"use server";

import clientPromise from "../lib/mongodb";
import { ObjectId } from "mongodb";

// 1. Internal helper to create a notification (Used by our other Server Actions)
export async function createNotification(assignedTo: string, message: string, link: string) {
  try {
    const client = await clientPromise;
    const db = client.db("intern_system");

    await db.collection("notifications").insertOne({
      assignedTo,
      message,
      link,
      isRead: false,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
}

// 2. Fetch unread notifications for the logged-in user
export async function getUnreadNotifications(userName: string) {
  try {
    const client = await clientPromise;
    const db = client.db("intern_system");

    const notifications = await db.collection("notifications")
      .find({ assignedTo: userName, isRead: false })
      .sort({ createdAt: -1 })
      .limit(10) // Only show the 10 most recent unread
      .toArray();

    return { 
      success: true, 
      notifications: notifications.map(n => ({
        id: n._id.toString(),
        message: n.message,
        link: n.link,
        createdAt: n.createdAt.toISOString()
      })) 
    };
  } catch (error) {
    return { success: false, notifications: [] };
  }
}

// 3. Mark a specific notification as Read
export async function markAsRead(notificationId: string) {
  try {
    const client = await clientPromise;
    const db = client.db("intern_system");

    await db.collection("notifications").updateOne(
      { _id: new ObjectId(notificationId) },
      { $set: { isRead: true } }
    );
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}