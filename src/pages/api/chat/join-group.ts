import type { NextApiRequest, NextApiResponse } from "next"
import { addMemberByApiKey, getGroup } from "@/lib/bandadaUtils"
import { getRoot } from "@/lib/useSemaphore"
import clientPromise from "@/lib/mongodb"


/**
 * API endpoint to add a member using an API key.
 * @param req The request object.
 * @param res The response object.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if the admin API key is defined.
  if (typeof process.env.BANDADA_APIKEY !== "string") {
    throw new Error(
      "Please, define BANDADA_APIKEY in your .env.development.local or .env.production.local file"
    )
  }

  // Retrieve the admin API key.
  const apiKey = process.env.BANDADA_APIKEY!
  // Extract groupId and commitment from the request body.
  const { groupId, commitment } = req.body

  try {
    // Add a member using the API key.
    await addMemberByApiKey(groupId, commitment, apiKey)

    // Get the group details.
    const group = await getGroup(groupId)

    // If group exists, update root history in the backend.
    if (group) {
      const groupRoot = await getRoot(group.members)
      const client = await clientPromise
      const db = client.db('hackathon')
      const collection = db.collection('root_history')
      const result = await collection.insertOne({ root: groupRoot.toString(), date: new Date().toISOString() })

      // Return success status if no errors.
      res.status(200).end()
    }
  } catch (error) {
    // Handle any errors that occur during the process.
    console.error(error)
    res.status(500).end()
  }
}
