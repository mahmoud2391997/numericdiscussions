import { NextResponse } from 'next/server'
import { getDB } from '@/lib/mongodb'
import { UserDocument, COLLECTIONS } from '@/lib/db-schemas'
import bcrypt from 'bcrypt'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 })
    }

    const db = await getDB()
    const usersCollection = db.collection<UserDocument>(COLLECTIONS.USERS)

    const user = await usersCollection.findOne({ username })

    if (!user) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || '')

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }

    const { password: _, ...userToReturn } = user

    return NextResponse.json(userToReturn, { status: 200 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
