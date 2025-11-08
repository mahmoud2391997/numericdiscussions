'use client'

import { useState, type FC } from 'react'
import { useDiscussions } from '@/context/discussions-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import CalculationNode from './calculation-node'
import ErrorDisplay from './error-display'
import AuthForm from './auth-form'

const MainView: FC = () => {
  const { currentUser, handleLogout, handleNewPost, calculationTrees, loading } = useDiscussions()
  const [startNumber, setStartNumber] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handlePost = async () => {
    setError(null)
    const num = parseFloat(startNumber)
    if (isNaN(num)) {
      setError('Please enter a valid number.')
      return
    }
    try {
      await handleNewPost(num)
      setStartNumber('')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {!currentUser ? (
        <AuthForm />
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Welcome, {currentUser.username}!</h1>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
          <div className="mb-6 p-4 border rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Create a new discussion</h2>
            <div className="flex gap-2">
              <Input
                type="number"
                value={startNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartNumber(e.target.value)}
                placeholder="Enter a starting number"
                className="w-full"
              />
              <Button onClick={handlePost} disabled={loading}>
                {loading ? 'Posting...' : 'Post'}
              </Button>
            </div>
            <ErrorDisplay message={error} />
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Discussions</h2>
        <div className="space-y-4">
          {calculationTrees.map(tree => (
            <CalculationNode key={tree.id} {...tree} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default MainView
