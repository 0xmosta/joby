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

  const { name, description, personToContact } = JSON.parse(req.body)

  try {
    const userData = await verifyToken(req)
    const user = await privyClient.getUserById(userData.userId)
    const identityPK = user.customMetadata.identity as string
    if (!identityPK) {
      return res.status(401).json({ message: 'User identity not found' })
    }
    const identity = new Identity(identityPK)

    const group = await bandada.createGroup({
      name: name.slice(0, 10) as string,
      description,
      fingerprintDuration: 3600,
      treeDepth: 16,
    }, API_KEY)
    console.log('new group', group)
    try {
      await bandada.addMemberByApiKey(group.id, identity.commitment as any, API_KEY)
    } catch (error) {
      console.error("Error adding member:", error)
      console.error(error)
    }
    const groupRoot = await getRoot(group.members)

    const client = await clientPromise
    const db = client.db('hackathon')

    const rootCollection = db.collection('rootHistory')
    await rootCollection.insertOne({
      _id: new ObjectId(),
      createdAt: new Date().toISOString(),
      root: groupRoot.toString()
    })

    const otherUser = await privyClient.getUserById(personToContact)
    const otherIdentityPK = otherUser.customMetadata.identity as string
    if (!otherIdentityPK) {
      return res.status(401).json({ message: 'otherUser identity not found' })
    }
    const otherIdentity = new Identity(otherIdentityPK)
    await bandada.addMemberByApiKey(group.id, otherIdentity.commitment as any, API_KEY)
    const otherGroupRoot = await getRoot(group.members)

    await rootCollection.insertOne({
      _id: new ObjectId(),
      createdAt: new Date().toISOString(),
      root: otherGroupRoot.toString()
    })

    const groupsCollection = db.collection('groups')
    await groupsCollection.insertOne({
      _id: new ObjectId(),
      id: group.id,
      name: name,
      root: otherGroupRoot
    })


    res.status(200).json({ message: 'Success' })
  } catch (error) {
    console.error(error)
    res.status(401).json({ message: 'Unauthorized' })
  }
}