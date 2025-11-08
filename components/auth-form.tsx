"use client"

import type React from "react"

import { useState } from "react"

interface AuthFormProps {
  onLogin: (username: string) => Promise<void>
  onRegister: (username: string) => Promise<void>
  isLoading?: boolean
}

export function AuthForm({ onLogin, onRegister, isLoading = false }: AuthFormProps) {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError("Username and password cannot be empty.")
      return
    }
    setError("")
    try {
      if (isLoginMode) {
        await onLogin(username)
      } else {
        await onRegister(username)
      }
      setUsername("")
      setPassword("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
        {isLoginMode ? "Login" : "Register"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            placeholder="Enter your username"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            placeholder="********"
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Loading..." : isLoginMode ? "Login" : "Create Account"}
        </button>
      </form>
      <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
        {isLoginMode ? "Don't have an account?" : "Already have an account?"}
        <button
          onClick={() => setIsLoginMode(!isLoginMode)}
          disabled={isLoading}
          className="text-indigo-600 dark:text-indigo-400 hover:underline ml-1 disabled:opacity-50"
        >
          {isLoginMode ? "Register" : "Login"}
        </button>
      </p>
    </div>
  )
}
