import type { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "@/lib/mongodb"
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Fetch feedback data from the database.
  try {
    const client = await clientPromise
    const db = client.db('hackathon')
    const collection = db.collection('messages')
    const result = await collection.find({}).toArray()
    res.status(200).json(result)

  } catch (error) {
    console.log(error)
    res.status(500).end()
  }
}
