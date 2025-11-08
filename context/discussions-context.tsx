'use client'

import type React from 'react'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { type User, type CalculationNodeData, OperationType } from '@/lib/types'

// Helper function to build the tree
const buildCalculationTree = (nodes: CalculationNodeData[]): CalculationNodeData[] => {
  const nodeMap = new Map<string, CalculationNodeData>()
  const childNodes = new Map<string, CalculationNodeData[]>()

  // First pass: create a map of all nodes
  nodes.forEach(node => {
    node.children = []
    nodeMap.set(node.id, node)
    if (node.parentId) {
      if (!childNodes.has(node.parentId)) {
        childNodes.set(node.parentId, [])
      }
      childNodes.get(node.parentId)!.push(node)
    }
  })

  // Second pass: build the tree
  const roots: CalculationNodeData[] = []
  nodes.forEach(node => {
    if (node.parentId === null) {
      roots.push(node)
    }
    if (childNodes.has(node.id)) {
      node.children = childNodes.get(node.id)!.sort((a, b) => a.timestamp - b.timestamp)
    }
  })

  return roots.sort((a, b) => b.timestamp - a.timestamp)
}


interface DiscussionsContextType {
  users: Map<string, User>
  calculationTrees: CalculationNodeData[]
  currentUser: User | null
  loading: boolean
  handleLogin: (username: string, password: string) => Promise<void>
  handleRegister: (username: string, password: string) => Promise<void>
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

  const fetchCalculations = useCallback(async () => {
    try {
      const calcsResponse = await fetch('/api/calculations')
      if (!calcsResponse.ok) {
        throw new Error('Failed to fetch calculations')
      }
      const calcsData = await calcsResponse.json()
      if (Array.isArray(calcsData)) {
        const tree = buildCalculationTree(calcsData)
        setCalculationTrees(tree)
      } else {
        console.error('[v0] Fetched calculations data is not an array:', calcsData)
      }
    } catch (error) {
      console.error('[v0] Failed to fetch calculations:', error)
    }
  }, [])


  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true)
      try {
        await Promise.all([
          (async () => {
            const usersResponse = await fetch("/api/users")
            if (!usersResponse.ok) throw new Error("Failed to fetch users")
            const usersData = await usersResponse.json()
            if (Array.isArray(usersData)) {
              setUsers(new Map(usersData.map((u: User) => [u.id, u])))
            } else {
               console.error("[v0] Fetched users data is not an array:", usersData)
            }
          })(),
          fetchCalculations(),
        ])
      } catch (error) {
        console.error("[v0] Failed to fetch initial data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchInitialData()
  }, [fetchCalculations])

  const handleLogin = useCallback(async (username: string, password: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Login failed')
      }
      const userData = await response.json()
      setCurrentUser(userData)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleRegister = useCallback(async (username: string, password: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Registration failed')
      }
      const newUser = await response.json()
      setUsers(prev => new Map(prev).set(newUser.id, newUser))
      setCurrentUser(newUser)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleLogout = () => {
    setCurrentUser(null)
  }

  const handleNewPost = useCallback(async (startNumber: number) => {
      if (!currentUser) throw new Error('You must be logged in to post.')
      setLoading(true)
      try {
        const response = await fetch('/api/calculations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: currentUser.id,
            operand: startNumber,
            result: startNumber,
          }),
        })
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to create post')
        }
        const newPost = await response.json()
        await fetchCalculations()
      } finally {
        setLoading(false)
      }
    },
    [currentUser, fetchCalculations],
  )

  const handleReply = useCallback(async (parentId: string, parentResult: number, operation: OperationType, operand: number) => {
      if (!currentUser) throw new Error('You must be logged in to reply.')

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
          if (operand === 0) throw new Error('Cannot divide by zero.')
          result = parentResult / operand
          break
        default:
            throw new Error('Invalid operation.')
      }
      
      setLoading(true)
      try {
        const response = await fetch('/api/calculations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: currentUser.id,
            parentId,
            operation,
            operand,
            parentResult,
            result,
          }),
        })
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to create reply')
        }
        await fetchCalculations()
      } finally {
        setLoading(false)
      }
    },
    [currentUser, fetchCalculations],
  )

  const value: DiscussionsContextType = {
    users,
    calculationTrees,
    currentUser,
    loading,
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
    throw new Error('useDiscussions must be used within DiscussionsProvider')
  }
  return context
}
