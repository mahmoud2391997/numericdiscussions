import { type NextRequest, NextResponse } from "next/server"
import { getDB } from "@/lib/mongodb"
import { COLLECTIONS, type UserDocument } from "@/lib/db-schemas"
import { crypto } from "node:crypto"

// GET all users
export async function GET() {
  try {
    const db = await getDB()
    const users = await db.collection<UserDocument>(COLLECTIONS.USERS).find({}).toArray()
    return NextResponse.json(users)
  } catch (error) {
    console.error("[v0] GET users error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

// POST create user
export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json()

    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 })
    }

    const db = await getDB()
    const existingUser = await db
      .collection<UserDocument>(COLLECTIONS.USERS)
      .findOne({ username: username.toLowerCase() })

    if (existingUser) {
      return NextResponse.json({ error: "Username already exists" }, { status: 409 })
    }

    const newUser: UserDocument = {
      id: `user-${crypto.randomUUID()}`,
      username,
      createdAt: new Date(),
    }

    const result = await db.collection<UserDocument>(COLLECTIONS.USERS).insertOne(newUser)
    return NextResponse.json({ ...newUser, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("[v0] POST users error:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
