"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { type User, type CalculationNodeData, OperationType } from "@/lib/types"

interface DiscussionsContextType {
  users: Map<string, User>
  calculationTrees: CalculationNodeData[]
  currentUser: User | null
  loading: boolean
  setCurrentUser: (user: User | null) => void
  handleLogin: (username: string) => Promise<void>
  handleRegister: (username: string) => Promise<void>
  handleLogout: () => void
  handleNewPost: (startNumber: number) => Promise<void>
  handleReply: (parentId: string, parentResult: number, operation: OperationType, operand: number) => Promise<void>
}

const DiscussionsContext = createContext<DiscussionsContextType | undefined>(undefined)

export function DiscussionsProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<Map<string, User>>(new Map())
  const [calculationTrees, setCalculationTrees] = useState<CalculationNodeData[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true)
        const usersResponse = await fetch("/api/users")
        const usersData = await usersResponse.json()
        const usersMap = new Map(usersData.map((u: User) => [u.id, u]))
        setUsers(usersMap)

        const calcsResponse = await fetch("/api/calculations")
        const calcsData = await calcsResponse.json()
        setCalculationTrees(calcsData)
      } catch (error) {
        console.error("[v0] Failed to fetch initial data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchInitialData()
  }, [])

  const handleLogin = useCallback(async (username: string) => {
    try {
      setLoading(true)
      const response = await fetch("/api/users")
      const usersData = await response.json()
      const user = usersData.find((u: User) => u.username.toLowerCase() === username.toLowerCase())
      if (!user) {
        alert("User not found. Please register first.")
        return
      }
      setCurrentUser(user)
    } catch (error) {
      console.error("[v0] Login error:", error)
      alert("Login failed")
    } finally {
      setLoading(false)
    }
  }, [])

  const handleRegister = useCallback(
    async (username: string) => {
      try {
        setLoading(true)
        const response = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        })
        if (!response.ok) {
          const error = await response.json()
          alert(error.error || "Registration failed")
          return
        }
        const newUser = await response.json()
        setUsers(new Map(users).set(newUser.id, newUser))
        setCurrentUser(newUser)
      } catch (error) {
        console.error("[v0] Registration error:", error)
        alert("Registration failed")
      } finally {
        setLoading(false)
      }
    },
    [users],
  )

  const handleLogout = () => {
    setCurrentUser(null)
  }

  const handleNewPost = useCallback(
    async (startNumber: number) => {
      if (!currentUser) return
      try {
        setLoading(true)
        const response = await fetch("/api/calculations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser.id,
            operand: startNumber,
            result: startNumber,
          }),
        })
        if (!response.ok) throw new Error("Failed to create post")
        const newPost = await response.json()
        setCalculationTrees([newPost, ...calculationTrees])
      } catch (error) {
        console.error("[v0] Failed to create post:", error)
        alert("Failed to create post")
      } finally {
        setLoading(false)
      }
    },
    [currentUser, calculationTrees],
  )

  const handleReply = useCallback(
    async (parentId: string, parentResult: number, operation: OperationType, operand: number) => {
      if (!currentUser) return

      let result: number
      switch (operation) {
        case OperationType.ADD:
          result = parentResult + operand
          break
        case OperationType.SUBTRACT:
          result = parentResult - operand
          break
        case OperationType.MULTIPLY:
          result = parentResult * operand
          break
        case OperationType.DIVIDE:
          result = parentResult / operand
          break
        default:
          return
      }

      try {
        setLoading(true)
        const response = await fetch("/api/calculations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser.id,
            parentId,
            operation,
            operand,
            parentResult,
            result,
          }),
        })
        if (!response.ok) throw new Error("Failed to create reply")

        // Fetch updated tree to reflect changes
        const calcsResponse = await fetch("/api/calculations")
        const calcsData = await calcsResponse.json()
        setCalculationTrees(calcsData)
      } catch (error) {
        console.error("[v0] Failed to create reply:", error)
        alert("Failed to create reply")
      } finally {
        setLoading(false)
      }
    },
    [currentUser],
  )

  const value: DiscussionsContextType = {
    users,
    calculationTrees,
    currentUser,
    loading,
    setCurrentUser,
    handleLogin,
    handleRegister,
    handleLogout,
    handleNewPost,
    handleReply,
  }

  return <DiscussionsContext.Provider value={value}>{children}</DiscussionsContext.Provider>
}

export function useDiscussions() {
  const context = useContext(DiscussionsContext)
  if (context === undefined) {
    throw new Error("useDiscussions must be used within DiscussionsProvider")
  }
  return context
}
