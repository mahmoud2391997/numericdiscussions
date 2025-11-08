import { NextResponse } from "next/server"
import { getDB } from "@/lib/mongodb"
import { COLLECTIONS, type UserDocument } from "@/lib/db-schemas"

// GET all users (without passwords)
export async function GET() {
  try {
    const db = await getDB()
    const users = await db
      .collection<UserDocument>(COLLECTIONS.USERS)
      .find({})
      .project({ password: 0 }) // Exclude password field
      .toArray()

    return NextResponse.json(users)
  } catch (error) {
    console.error("GET users error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
