export interface User {
  id: string
  username: string
}

export enum OperationType {
  ADD = "+",
  SUBTRACT = "-",
  MULTIPLY = "*",
  DIVIDE = "/",
}

export interface CalculationNodeData {
  id: string
  userId: string
  parentId: string | null
  operation: OperationType | null
  operand: number
  parentResult: number
  result: number
  timestamp: number
  children: CalculationNodeData[]
}
