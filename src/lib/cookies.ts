import { NextApiRequest } from "next"
import { privyClient } from '@/lib/privyclient'
import { AuthTokenClaims } from "@privy-io/server-auth"

export const verifyToken = async (req: NextApiRequest): Promise<AuthTokenClaims> => {
  try {
    const cookies = req.cookies; 
    const privyToken = cookies['privy-token']; // Retrieve a specific cookie
    const verifiedClaims = await privyClient.verifyAuthToken(privyToken as string)
    if (!verifiedClaims.userId) {
      throw new Error('Invalid token')
    } else return verifiedClaims
  } catch (error) {
    throw new Error('Invalid token')
  }
  
}