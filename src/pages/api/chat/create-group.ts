import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyToken } from '@/lib/cookies'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { bandada } from '@/lib/bandada'

type ResponseData = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const userData = await verifyToken(req)
    console.log(userData)
    const group = await bandada.createGroup({
      name: 'test',
      description: 'test',
      fingerprintDuration: 3600,
      treeDepth: 16,
    }, process.env.BANDADA_APIKEY!)

    const groupId = group.id
    const client = await clientPromise
    const db = client.db('hackathon')
    const collection = db.collection('groups')
    const result = await collection.insertOne({
      _id: new ObjectId(),
      id: groupId,
      name: group.name,
    })

    res.status(200).json({ message: 'Success' })
  } catch (error) {
    console.log(error)
    res.status(401).json({ message: 'Unauthorized' })
  }
}