import { type NextRequest, NextResponse } from "next/server"
import { getDB } from "@/lib/mongodb"
import { COLLECTIONS, type CalculationDocument } from "@/lib/db-schemas"

// GET calculation by id with children
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDB()

    // Recursive function to fetch node and all children
    async function fetchNodeWithChildren(nodeId: string): Promise<CalculationDocument | null> {
      const node = await db.collection<CalculationDocument>(COLLECTIONS.CALCULATIONS).findOne({ id: nodeId })

      if (!node) return null

      const children = await db
        .collection<CalculationDocument>(COLLECTIONS.CALCULATIONS)
        .find({ parentId: nodeId })
        .toArray()

      return {
        ...node,
        children: children as any,
      }
    }

    const calculation = await fetchNodeWithChildren(id)
    if (!calculation) {
      return NextResponse.json({ error: "Calculation not found" }, { status: 404 })
    }
    return NextResponse.json(calculation)
  } catch (error) {
    console.error("[v0] GET calculation error:", error)
    return NextResponse.json({ error: "Failed to fetch calculation" }, { status: 500 })
  }
}

// DELETE calculation
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const db = await getDB()

    // Delete this node and all children
    async function deleteNodeAndChildren(nodeId: string): Promise<number> {
      const children = await db
        .collection<CalculationDocument>(COLLECTIONS.CALCULATIONS)
        .find({ parentId: nodeId })
        .toArray()

      let deletedCount = 0
      for (const child of children) {
        deletedCount += await deleteNodeAndChildren(child.id)
      }

      const result = await db.collection<CalculationDocument>(COLLECTIONS.CALCULATIONS).deleteOne({ id: nodeId })
      return result.deletedCount + deletedCount
    }

    const deletedCount = await deleteNodeAndChildren(id)
    if (deletedCount === 0) {
      return NextResponse.json({ error: "Calculation not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, deletedCount })
  } catch (error) {
    console.error("[v0] DELETE calculation error:", error)
    return NextResponse.json({ error: "Failed to delete calculation" }, { status: 500 })
  }
}
