import { MongoClient, type Db } from "mongodb"

let client: MongoClient | null = null
let db: Db | null = null

export async function connectDB(): Promise<Db> {
  if (db) return db

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set")
  }

  try {
    client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017/")
    await client.connect()
    db = client.db(process.env.MONGODB_DB_NAME || "myapp")
    console.log("[v0] Connected to MongoDB")
    return db
  } catch (error) {
    console.error("[v0] MongoDB connection error:", error)
    throw error
  }
}

export async function getDB(): Promise<Db> {
  if (!db) {
    return connectDB()
  }
  return db
}
