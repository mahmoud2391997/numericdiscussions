import { type NextRequest, NextResponse } from "next/server"
import { getDB } from "@/lib/mongodb"
import { COLLECTIONS, type CalculationDocument } from "@/lib/db-schemas"

// GET all calculations for a user (root nodes only)
export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params
    const db = await getDB()
    const calculations = await db
      .collection<CalculationDocument>(COLLECTIONS.CALCULATIONS)
      .find({ userId, parentId: null })
      .sort({ timestamp: -1 })
      .toArray()
    return NextResponse.json(calculations)
  } catch (error) {
    console.error("[v0] GET user calculations error:", error)
    return NextResponse.json({ error: "Failed to fetch calculations" }, { status: 500 })
  }
}
