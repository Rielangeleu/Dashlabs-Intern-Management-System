"use server";

import clientPromise from "../lib/mongodb";
import bcrypt from "bcryptjs";

export async function registerUser(userData: { name: string; email: string; password: string; role: string }) {
  try {
    const client = await clientPromise;
    const db = client.db("intern_system");

    // 1. Check if email already exists
    const existingUser = await db.collection("users").findOne({ email: userData.email });
    if (existingUser) {
      return { success: false, error: "Email already in use." };
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // 3. Save to MongoDB
    await db.collection("users").insertOne({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || "Intern", // Default role
      createdAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error("Registration Error:", error);
    return { success: false, error: "Failed to create account." };
  }
}