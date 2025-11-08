"use client"

import { useState } from "react"
import type { CalculationNodeData, User, OperationType } from "@/lib/types"
import { ReplyForm } from "./reply-form"
import { UserIcon } from "./icons"

interface CalculationNodeProps {
  node: CalculationNodeData
  users: Map<string, User>
  onReply: (parentId: string, parentResult: number, operation: OperationType, operand: number) => Promise<void>
  currentUser: User | null
  depth?: number
  isLoading?: boolean
}

export function CalculationNode({
  node,
  users,
  onReply,
  currentUser,
  depth = 0,
  isLoading = false,
}: CalculationNodeProps) {
  const [isReplying, setIsReplying] = useState(false)
  const user = users.get(node.userId) || { username: "Unknown" }

  const handleReplySubmit = async (operation: OperationType, operand: number) => {
    try {
      await onReply(node.id, node.result, operation, operand)
      setIsReplying(false)
    } catch (error) {
      console.error("[v0] Reply submission error:", error)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className={`mt-4 ${depth > 0 ? "ml-6 pl-6 border-l-2 border-gray-200 dark:border-gray-700" : ""}`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 text-center">
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            <UserIcon className="w-8 h-8" />
          </div>
          <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1">{user.username}</span>
        </div>
        <div className="flex-grow">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{formatDate(node.timestamp)}</div>
          <div className="text-gray-800 dark:text-gray-200">
            {node.parentId === null ? (
              <p className="text-2xl font-bold">{node.result}</p>
            ) : (
              <p className="text-lg">
                <span className="text-gray-500 dark:text-gray-400">{node.parentResult}</span>
                <span className="font-bold text-indigo-500 mx-2">{node.operation}</span>
                <span className="text-gray-500 dark:text-gray-400">{node.operand}</span>
                <span className="font-bold mx-2">=</span>
                <span className="font-bold text-2xl">{node.result}</span>
              </p>
            )}
          </div>
          {currentUser && (
            <button
              onClick={() => setIsReplying(!isReplying)}
              disabled={isLoading}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reply
            </button>
          )}
        </div>
      </div>

      {isReplying && (
        <ReplyForm onSubmit={handleReplySubmit} onCancel={() => setIsReplying(false)} isLoading={isLoading} />
      )}

      <div className="children-container">
        {node.children &&
          node.children.map((child) => (
            <CalculationNode
              key={child.id}
              node={child}
              users={users}
              onReply={onReply}
              currentUser={currentUser}
              depth={depth + 1}
              isLoading={isLoading}
            />
          ))}
      </div>
    </div>
  )
}
