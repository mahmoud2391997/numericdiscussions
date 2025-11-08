import { OperationType, type CalculationNodeData, type User } from "./types"

export const initialUsers: User[] = [
  { id: "user-1", username: "Alex" },
  { id: "user-2", username: "George" },
  { id: "user-3", username: "Masha" },
]

export const initialCalculations: CalculationNodeData[] = [
  {
    id: "root-1",
    userId: "user-1",
    parentId: null,
    operation: null,
    operand: 100,
    parentResult: 0,
    result: 100,
    timestamp: new Date("2024-01-01T10:00:00Z").getTime(),
    children: [
      {
        id: "child-1.1",
        userId: "user-2",
        parentId: "root-1",
        operation: OperationType.ADD,
        operand: 50,
        parentResult: 100,
        result: 150,
        timestamp: new Date("2024-01-01T11:00:00Z").getTime(),
        children: [
          {
            id: "child-1.1.1",
            userId: "user-3",
            parentId: "child-1.1",
            operation: OperationType.MULTIPLY,
            operand: 2,
            parentResult: 150,
            result: 300,
            timestamp: new Date("2024-01-01T12:00:00Z").getTime(),
            children: [],
          },
        ],
      },
      {
        id: "child-1.2",
        userId: "user-3",
        parentId: "root-1",
        operation: OperationType.SUBTRACT,
        operand: 25,
        parentResult: 100,
        result: 75,
        timestamp: new Date("2024-01-01T11:30:00Z").getTime(),
        children: [],
      },
    ],
  },
  {
    id: "root-2",
    userId: "user-2",
    parentId: null,
    operation: null,
    operand: 2048,
    parentResult: 0,
    result: 2048,
    timestamp: new Date("2024-01-02T14:00:00Z").getTime(),
    children: [],
  },
]
