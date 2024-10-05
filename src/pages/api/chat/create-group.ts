import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyToken } from '@/lib/cookies'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { bandada } from '@/lib/bandada'
import { privyClient } from '@/lib/privyclient'
import { Identity } from '@semaphore-protocol/core'
import { getRoot } from '@/lib/useSemaphore'

type ResponseData = {
  message: string
}

const API_KEY = process.env.BANDADA_APIKEY!

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { name, description } =
    req.body

  try {
    const userData = await verifyToken(req)
    const user = await privyClient.getUserById(userData.userId)
    const identityPK = user.customMetadata.identity as string
    if (!identityPK) {
      return res.status(401).json({ message: 'User identity not found' })
    }
    const identity = new Identity(identityPK)

    const group = await bandada.createGroup({
      name,
      description,
      fingerprintDuration: 3600,
      treeDepth: 16,
    }, API_KEY)


    await bandada.addMemberByApiKey(group.id, identity.commitment as any, API_KEY)

    const groupRoot = await getRoot(group.members)

    const client = await clientPromise
    const db = client.db('hackathon')

    const rootCollection = db.collection('rootHistory')
    await rootCollection.insertOne({
      _id: new ObjectId(),
      createdAt: new Date().toISOString(),
      root: groupRoot.toString()
    })

    const groupsCollection = db.collection('groups')
    await groupsCollection.insertOne({
      _id: new ObjectId(),
      id: group.id,
      name: name,
    })


    res.status(200).json({ message: 'Success' })
  } catch (error) {
    console.log(error)
    res.status(401).json({ message: 'Unauthorized' })
  }
}