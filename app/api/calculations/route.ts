import { type NextRequest, NextResponse } from "next/server"
import { getDB } from "@/lib/mongodb"
import { COLLECTIONS, type CalculationDocument } from "@/lib/db-schemas"
import crypto from "crypto"

// GET all calculations
export async function GET() {
  try {
    const db = await getDB()
    const calculations = await db
      .collection<CalculationDocument>(COLLECTIONS.CALCULATIONS)
      .find({})
      .sort({ timestamp: -1 })
      .toArray()
    return NextResponse.json(calculations)
  } catch (error) {
    console.error("[v0] GET calculations error:", error)
    return NextResponse.json({ error: "Failed to fetch calculations" }, { status: 500 })
  }
}

// POST create calculation node
export async function POST(req: NextRequest) {
  try {
    const { userId, parentId, operation, operand, parentResult, result } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    const db = await getDB()
    const newCalc: CalculationDocument = {
      id: parentId ? `child-${crypto.randomUUID()}` : `root-${crypto.randomUUID()}`,
      userId,
      parentId: parentId || null,
      operation: operation || null,
      operand,
      parentResult: parentResult || 0,
      result,
      timestamp: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result_insert = await db.collection<CalculationDocument>(COLLECTIONS.CALCULATIONS).insertOne(newCalc)
    return NextResponse.json({ ...newCalc, _id: result_insert.insertedId }, { status: 201 })
  } catch (error) {
    console.error("[v0] POST calculations error:", error)
    return NextResponse.json({ error: "Failed to create calculation" }, { status: 500 })
  }
}
