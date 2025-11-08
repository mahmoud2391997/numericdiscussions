'use client'

import { type FC } from 'react'

interface ErrorDisplayProps {
  message: string | null
}

const ErrorDisplay: FC<ErrorDisplayProps> = ({ message }) => {
  if (!message) return null

  return (
    <div className="mt-2 rounded-md bg-red-100 p-3 text-sm text-red-700">
      <p>{message}</p>
    </div>
  )
}

export default ErrorDisplay
