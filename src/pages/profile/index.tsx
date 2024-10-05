"use client"
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { usePrivy } from '@privy-io/react-auth'
import DashboardLayout from '@/components/Dashboard'
import Avatar, { genConfig } from 'react-nice-avatar'
import axios from 'axios'
import { Github, Wallet, Mail, FileText, Loader2 } from 'lucide-react'

const BACKEND_URL = "https://joby-backend.fly.dev"

export default function UserProfilePage() {
  const { user } = usePrivy()
  const [developer, setDeveloper] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user?.wallet?.address) {
      fetchDeveloper(user.wallet.address)
    }
  }, [user])

  const fetchDeveloper = async (address) => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${BACKEND_URL}/developers/${address}`)
      setDeveloper(response.data)
      setIsLoading(false)
    } catch (err) {
      console.error('Error fetching developer:', err)
      setError('Failed to fetch developer information')
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-400">
          {error}
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col bg-gray-900 w-full min-h-screen py-4 sm:py-20 items-center gap-2 p-2 text-white">
        <Card className="w-full max-w-3xl mx-auto shadow-lg bg-gray-800 border-gray-700">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-t-lg">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-4">
              <Avatar className='w-24 h-24 mb-4 sm:mb-0 border-4 border-gray-200' {...genConfig(user?.wallet?.address || '')} />
              <div className="text-center sm:text-left">
                <CardTitle className="text-2xl sm:text-3xl font-bold">{user?.github?.username}</CardTitle>
                <CardDescription className="text-sm text-gray-300 break-all mt-2">{user?.wallet?.address}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="github" className="text-lg font-semibold flex items-center text-gray-300">
                <Github className="mr-2" /> GitHub Username
              </Label>
              <Input id="github" value={user?.github?.username || ''} disabled className="bg-gray-700 text-white border-gray-600" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wallet" className="text-lg font-semibold flex items-center text-gray-300">
                <Wallet className="mr-2" /> Wallet Address
              </Label>
              <Input id="wallet" value={user?.wallet?.address || ''} disabled className="bg-gray-700 text-white border-gray-600" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-lg font-semibold flex items-center text-gray-300">
                <FileText className="mr-2" /> Bio
              </Label>
              <div className="p-3 bg-gray-700 rounded-md text-gray-300 min-h-[100px]">
                {developer?.bio || 'No bio provided'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
