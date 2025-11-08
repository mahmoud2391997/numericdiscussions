'use client'

import React, { useState, type FC } from 'react'
import { useDiscussions } from '@/context/discussions-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ErrorDisplay from './error-display'

const AuthForm: FC = () => {
  const { handleLogin, handleRegister, loading } = useDiscussions()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onAuth = async () => {
    setError(null)
    try {
      if (isRegister) {
        await handleRegister(username, password)
      } else {
        await handleLogin(username, password)
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-sm mx-auto p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">{isRegister ? 'Register' : 'Login'}</h2>
      <div className="flex flex-col gap-4">
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
        <Button onClick={onAuth} disabled={loading}>
          {loading ? (isRegister ? 'Registering...' : 'Logging in...') : (isRegister ? 'Register' : 'Login')}
        </Button>
        <Button variant="link" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
        </Button>
      </div>
      <ErrorDisplay message={error} />
    </div>
  )
}

export default AuthForm
