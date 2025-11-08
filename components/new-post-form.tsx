"use client"

import type React from "react"

import { useState } from "react"

interface NewPostFormProps {
  onNewPost: (startNumber: number) => Promise<void>
  isLoading?: boolean
}

export function NewPostForm({ onNewPost, isLoading = false }: NewPostFormProps) {
  const [number, setNumber] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const num = Number.parseFloat(number)
    if (isNaN(num)) {
      setError("Please enter a valid number.")
      return
    }
    setError("")
    try {
      await onNewPost(num)
      setNumber("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post")
    }
  }

  return (
    <div className="container mx-auto mt-8">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Start a New Discussion</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            disabled={isLoading}
            placeholder="Enter a starting number"
            className="flex-grow w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Posting..." : "Post"}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </div>
  )
}
