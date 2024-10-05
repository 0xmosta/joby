"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from './ui/button'
import { useRouter } from 'next/router'
import { usePrivy } from '@privy-io/react-auth'
import axios from 'axios'

const BACKEND_URL = "https://joby-backend.fly.dev"

export default function OnboardDev1() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [showDescription, setShowDescription] = useState(false)
  const [userDescription, setUserDescription] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [hasAttemptedRegistration, setHasAttemptedRegistration] = useState(false)
  const { user } = usePrivy()

  useEffect(() => {
    if (user?.wallet?.address) {
      console.log("User wallet address detected:", user.wallet.address)
      checkAndRegisterDeveloper()
    } else {
      console.log("User wallet address not found")
    }
  }, [user])

  const checkAndRegisterDeveloper = async () => {
    if (!user?.wallet?.address || !user?.github?.username) {
      console.log("Missing wallet address or GitHub username")
      setIsLoading(false)
      setError('Wallet address or GitHub username not found')
      return
    }

    try {
      console.log("Attempting to fetch developer:", user.wallet.address)
      const response = await axios.get(`${BACKEND_URL}/developers/${user.wallet.address}`)
      console.log("Developer found:", response.data)
      setUserDescription(response.data.bio.split('\n').filter((line: string) => line.trim() !== ''))
      setIsLoading(false)
      setShowDescription(true)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log("Developer not found, attempting registration")
        if (!hasAttemptedRegistration) {
          await registerDeveloper()
        } else {
          console.log("Registration already attempted, not trying again")
          setIsLoading(false)
          setError('Unable to register developer. Please try again later.')
        }
      } else {
        console.error('Error checking developer:', error)
        setIsLoading(false)
        setError('An error occurred while fetching your profile. Please try again later.')
      }
    }
  }

  const registerDeveloper = async () => {
    if (!user?.wallet?.address || !user?.github?.username) return

    try {
      console.log("Registering developer:", user.wallet.address, user.github.username)
      setHasAttemptedRegistration(true)
      const response = await axios.post(`${BACKEND_URL}/register_developer/`, {
        address: user.wallet.address,
        github_username: user.github.username
      })
      console.log("Registration successful:", response.data)
      setUserDescription(response.data.bio.split('\n').filter((line: string) => line.trim() !== ''))
      setIsLoading(false)
      setShowDescription(true)
    } catch (error) {
      console.error('Error registering developer:', error)
      setIsLoading(false)
      setError('An error occurred while creating your profile. Please try again later.')
    }
  }

  const handleRetry = () => {
    console.log("Retrying registration process")
    setIsLoading(true)
    setError(null)
    setHasAttemptedRegistration(false)
    checkAndRegisterDeveloper()
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col gap-2 items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-white">
            {isLoading ? "Creating your profile" : error ? "Error" : "Your Profile"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-gray-300">Please wait while we create your profile...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <AlertCircle className="h-8 w-8 text-red-400" />
              <p className="text-red-400 text-center">{error}</p>
              <Button onClick={handleRetry} variant="outline" className="border-gray-600 text-white hover:bg-gray-700">Retry</Button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {userDescription.map((line, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: showDescription ? 1 : 0, y: showDescription ? 0 : 20 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="mb-2 text-gray-300"
                >
                  {line}
                </motion.p>
              ))}
            </motion.div>
          )}
        </CardContent>
      </Card>

      {!isLoading && !error && (
        <Button 
          onClick={() => {
            console.log("Navigating to profile page")
            router.push('/profile')
          }} 
          className='w-full max-w-md bg-primary hover:bg-primary/80 text-white'
        >
          Next
        </Button>
      )}
    </div>
  )
}
