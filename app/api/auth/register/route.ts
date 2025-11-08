import { NextResponse } from 'next/server'
import { getDB } from '@/lib/mongodb'
import { UserDocument, COLLECTIONS } from '@/lib/db-schemas'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 })
    }

    const db = await getDB()
    const usersCollection = db.collection<UserDocument>(COLLECTIONS.USERS)

    const existingUser = await usersCollection.findOne({ username })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser: UserDocument = {
      id: uuidv4(),
      username,
      password: hashedPassword,
      createdAt: new Date(),
    }

    await usersCollection.insertOne(newUser)

    const { password: _, ...user } = newUser

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
