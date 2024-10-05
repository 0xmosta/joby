import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyToken } from '@/lib/cookies'
import { Identity } from "@semaphore-protocol/core"
import { privyClient } from '@/lib/privyclient'

export type UserInfoResponse = {
  message: string,
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
    const identity = new Identity().export()
    await privyClient.setCustomMetadata(userData.userId, {
      identity
    })
    return res.status(200).json({ message: 'User Info' })
  } catch (error) {
    console.log(error)
    return res.status(401).json({ message: 'Unauthorized' })
  }
}