"use client"

import type { User } from "@/lib/types"

interface HeaderProps {
  currentUser: User | null
  onLogout: () => void
}

export function Header({ currentUser, onLogout }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Numeric Discussions</h1>
        {currentUser ? (
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 dark:text-gray-300">
              Welcome, <span className="font-semibold">{currentUser.username}</span>
            </span>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">Please log in to participate.</p>
        )}
      </div>
    </header>
  )
}
