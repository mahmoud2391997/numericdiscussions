"use client"

import type React from "react"

import { useState } from "react"
import { OperationType } from "@/lib/types"
import { PlusIcon, MinusIcon, MultiplyIcon, DivideIcon } from "./icons"

interface ReplyFormProps {
  onSubmit: (operation: OperationType, operand: number) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

const operationIcons: Record<OperationType, React.ReactElement> = {
  [OperationType.ADD]: <PlusIcon className="w-5 h-5" />,
  [OperationType.SUBTRACT]: <MinusIcon className="w-5 h-5" />,
  [OperationType.MULTIPLY]: <MultiplyIcon className="w-5 h-5" />,
  [OperationType.DIVIDE]: <DivideIcon className="w-5 h-5" />,
}

export function ReplyForm({ onSubmit, onCancel, isLoading = false }: ReplyFormProps) {
  const [operation, setOperation] = useState<OperationType>(OperationType.ADD)
  const [operand, setOperand] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const num = Number.parseFloat(operand)
    if (isNaN(num)) {
      setError("Please enter a valid number.")
      return
    }
    if (operation === OperationType.DIVIDE && num === 0) {
      setError("Cannot divide by zero.")
      return
    }
    setError("")
    try {
      await onSubmit(operation, num)
      setOperand("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit reply")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        {(Object.values(OperationType) as OperationType[]).map((op) => (
          <button
            key={op}
            type="button"
            onClick={() => setOperation(op)}
            disabled={isLoading}
            className={`p-2 rounded-full transition-colors duration-200 disabled:opacity-50 ${
              operation === op
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
            }`}
          >
            {operationIcons[op]}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={operand}
          onChange={(e) => setOperand(e.target.value)}
          disabled={isLoading}
          placeholder="Your number"
          className="flex-grow w-full px-3 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "..." : "Submit"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </form>
  )
}
