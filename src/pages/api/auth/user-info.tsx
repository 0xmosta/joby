import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyToken } from '@/lib/cookies'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { Identity } from "@semaphore-protocol/core"

export type UserInfoResponse = {
  message: string,
  user?: {
    id: string,
    identity: string
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserInfoResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const userData = await verifyToken(req)
    console.log(userData)

    const client = await clientPromise
    const db = client.db('hackathon')
    const collection = db.collection('joby')

    const existingUser = await collection.findOne({ id: userData.userId })

    if (existingUser) {
      // User exists, return their data
      res.status(200).json({ message: 'User found', user: existingUser as any })
    } else {
      // User doesn't exist, create new user
      const identity = new Identity().export()
      const newUser = {
        _id: new ObjectId(),
        id: userData.userId,
        identity: identity,
      }
      await collection.insertOne(newUser)
      res.status(201).json({ message: 'New user created', user: newUser })
    }
  } catch (error) {
    console.log(error)
    res.status(401).json({ message: 'Unauthorized' })
  }
}