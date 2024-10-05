"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from './ui/button'
import { useRouter } from 'next/router'

export default function OnboardDev1() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [showDescription, setShowDescription] = useState(false)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      // Start revealing the description after loading is complete
      const timer = setTimeout(() => {
        setShowDescription(true)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [isLoading])

  const userDescription = [
    "Name: John Doe",
    "Age: 30",
    "Occupation: Software Developer",
    "Hobbies: Coding, Reading, Hiking",
    "Favorite Quote: 'The only way to do great work is to love what you do.'"
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col gap-2 items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {isLoading ? "Creating your profile" : "Your Profile"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <p className="text-gray-600">Please wait while we create your profile...</p>
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
                  className="mb-2 text-gray-700"
                >
                  {line}
                </motion.p>
              ))}
            </motion.div>
          )}
        </CardContent>
      </Card>

      <Button onClick={() => {
        router.push('/profile')
      }} disabled={isLoading} className='w-full max-w-md'>Next</Button>
    </div>
  )
}