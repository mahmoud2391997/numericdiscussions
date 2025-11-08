import { type NextRequest, NextResponse } from "next/server"
import { getDB } from "@/lib/mongodb"
import { COLLECTIONS, type UserDocument } from "@/lib/db-schemas"

// GET user by id
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDB()
    const user = await db.collection<UserDocument>(COLLECTIONS.USERS).findOne({ id })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    return NextResponse.json(user)
  } catch (error) {
    console.error("[v0] GET user error:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

// DELETE user
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDB()
    const result = await db.collection<UserDocument>(COLLECTIONS.USERS).deleteOne({ id })
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] DELETE user error:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
