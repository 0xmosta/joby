import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyToken } from '@/lib/cookies'
import { bandada } from '@/lib/bandada'
import { privyClient } from '@/lib/privyclient'
import { Identity } from '@semaphore-protocol/core'

type ResponseData = {
  message: string,
  groups?: any[]
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
    const user = await privyClient.getUserById(userData.userId)
    const identityPK = user.customMetadata.identity as string
    if (!identityPK) {
      return res.status(401).json({ message: 'User identity not found' })
    }
    const identity = new Identity(identityPK)
    const groups = await bandada.getGroupsByMemberId(identity?.commitment as unknown as string)

    res.status(200).json({ message: 'Success', groups })
  } catch (error) {
    console.log(error)
    res.status(401).json({ message: 'Unauthorized' })
  }
}