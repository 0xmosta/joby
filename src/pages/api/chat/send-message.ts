import type { NextApiRequest, NextApiResponse } from "next"
import { generateProof, Group, Identity, verifyProof } from "@semaphore-protocol/core"
import { getGroup, getMembersGroup } from "@/lib/bandadaUtils"
import clientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/cookies"
import { privyClient } from "@/lib/privyclient"
import { encodeBytes32String, toBigInt } from "ethers"

const BANDADA_GROUP_ID = '10085507080601042084914096287011'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  let errorLog = ""

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  // Extract feedback, merkleTreeRoot, nullifierHash, and proof from the request body.
  const { messageToSend } = req.body

  const userData = await verifyToken(req)
  const user = await privyClient.getUserById(userData.userId)
  const identityPK = user.customMetadata.identity as string
  if (!identityPK) {
    return res.status(401).json({ message: 'User identity not found' })
  }
  const identity = new Identity(identityPK)

  const users = await getMembersGroup(BANDADA_GROUP_ID)

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
    BANDADA_GROUP_ID
  )

  try {
    const group = await getGroup(BANDADA_GROUP_ID)

    //* Get current merkel root 
    const client = await clientPromise
    const db = client.db('hackathon')
    const currentMerkleRoot = await db.collection('rootHistory').findOne({})

    if (!currentMerkleRoot) {
      throw new Error("Current root not found")
    }
    // const currentMerkleRoot = await db.collection("rootHistory")
    //   .find()
    //   .sort({ createdAt: -1 })
    //   .limit(1)
    //   .toArray()

    console.log("PARAMS")
    console.log("merkleTreeDepth", merkleTreeDepth)
    console.log("merkleTreeRoot", merkleTreeRoot)
    console.log("feedback", feedback)
    console.log("nullifierHash", nullifierHash)
    console.log("points", points)


    const isVerified = await verifyProof({
      merkleTreeDepth,
      merkleTreeRoot,
      message: feedback,
      nullifier: nullifierHash,
      scope: BANDADA_GROUP_ID,
      points
    })

    if (!isVerified) {
      const errorLog = "The proof was not verified successfully"
      console.error(errorLog)
      res.status(500).send(errorLog)
      return
    }

    const feedbackCollection = db.collection('feedback')
    await feedbackCollection.insertOne({ message: feedback, createdAt: new Date() })
    return res.status(200).json({ message: 'Success' })

  } catch (error) {
    console.error(`error`, error)
  }
}
