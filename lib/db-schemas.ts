// MongoDB collection schemas and indexes
export const COLLECTIONS = {
  USERS: "users",
  CALCULATIONS: "calculations",
}

export interface UserDocument {
  _id?: string
  id: string
  username: string
  createdAt: Date
}

export interface CalculationDocument {
  _id?: string
  id: string
  userId: string
  parentId: string | null
  operation: string | null
  operand: number
  parentResult: number
  result: number
  timestamp: number
  createdAt: Date
  updatedAt: Date
}
