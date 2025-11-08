'use client'

import { useState } from 'react'
import type { CalculationNodeData } from '@/lib/types'
import { ReplyForm } from './reply-form'
import { UserIcon } from './icons'
import { useDiscussions } from '@/context/discussions-context'
import ErrorDisplay from './error-display'

interface CalculationNodeProps extends CalculationNodeData {}

const CalculationNode: React.FC<CalculationNodeProps> = (props) => {
  const { id, userId, timestamp, parentId, parentResult, operation, operand, result, children } = props
  const { users, handleReply, currentUser, loading } = useDiscussions()
  const [isReplying, setIsReplying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const user = users.get(userId) || { username: 'Unknown' }

  const onReply = async (op: any, val: any) => {
    setError(null)
    try {
      await handleReply(id, result, op, val)
      setIsReplying(false)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const formatDate = (ts: number) => new Date(ts).toLocaleString()

  return (
    <div className="ml-6 pl-6 border-l-2 border-gray-200 dark:border-gray-700">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 text-center">
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            <UserIcon className="w-8 h-8" />
          </div>
          <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1">{user.username}</span>
        </div>
        <div className="flex-grow">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{formatDate(timestamp)}</div>
          <div className="text-gray-800 dark:text-gray-200">
            {parentId === null ? (
              <p className="text-2xl font-bold">{result}</p>
            ) : (
              <p className="text-lg">
                <span className="text-gray-500 dark:text-gray-400">{parentResult}</span>
                <span className="font-bold text-indigo-500 mx-2">{operation}</span>
                <span className="text-gray-500 dark:text-gray-400">{operand}</span>
                <span className="font-bold mx-2">=</span>
                <span className="font-bold text-2xl">{result}</span>
              </p>
            )}
          </div>
          {currentUser && (
            <button
              onClick={() => setIsReplying(!isReplying)}
              disabled={loading}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reply
            </button>
          )}
        </div>
      </div>

      {isReplying && (
        <div className="mt-4">
          <ReplyForm onSubmit={onReply} onCancel={() => setIsReplying(false)} isLoading={loading} />
          <ErrorDisplay message={error} />
        </div>
      )}

      <div className="children-container mt-4">
        {children &&
          children.map((child: CalculationNodeData) => (
            <CalculationNode key={child.id} {...child} />
          ))}
      </div>
    </div>
  )
}

export default CalculationNode
