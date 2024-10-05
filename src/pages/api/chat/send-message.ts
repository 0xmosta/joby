import type { NextApiRequest, NextApiResponse } from "next"
import { generateProof, Group, Identity, verifyProof } from "@semaphore-protocol/core"
import { getGroup, getMembersGroup } from "@/lib/bandadaUtils"
import clientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/cookies"
import { privyClient } from "@/lib/privyclient"
import { encodeBytes32String, toBigInt } from "ethers"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let errorLog = ""

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  // Extract feedback, merkleTreeRoot, nullifierHash, and proof from the request body.
  const { messageToSend, groupId } = JSON.parse(req.body)

  const userData = await verifyToken(req)
  const user = await privyClient.getUserById(userData.userId)
  const identityPK = user.customMetadata.identity as string
  if (!identityPK) {
    return res.status(401).json({ message: 'User identity not found' })
  }
  const identity = new Identity(identityPK)

  const users = await getMembersGroup(groupId)

  if (!users) {
    return res.status(401).json({ message: 'Users not found' })
  }

  const semaphoreGroup = new Group(users)

  if (!semaphoreGroup) {
    throw new Error("Group not found")
  }

  const message = toBigInt(encodeBytes32String(messageToSend)).toString()

  const { points, merkleTreeDepth, merkleTreeRoot, message: feedback, nullifier: nullifierHash } = await generateProof(
    identity!,
    semaphoreGroup,
    message,
    groupId
  )

  try {
    const group = await getGroup(groupId)

    //* Get current merkel root 
    const client = await clientPromise
    const db = client.db('hackathon')
    const currentMerkleRoot = await db.collection('rootHistory').findOne({})

    if (!currentMerkleRoot) {
      throw new Error("Current root not found")
    }
 
    const isVerified = await verifyProof({
      merkleTreeDepth,
      merkleTreeRoot,
      message: feedback,
      nullifier: nullifierHash,
      scope: groupId,
      points
    })

    if (!isVerified) {
      const errorLog = "The proof was not verified successfully"
      console.error(errorLog)
      res.status(500).send(errorLog)
      return
    }

    const feedbackCollection = db.collection('feedback')
    await feedbackCollection.insertOne({ message: feedback, createdAt: new Date(), groupId, sender: userData.userId })
    return res.status(200).json({ message: 'Success' })

  } catch (error) {
    console.error(`error`, error)
  }
}
