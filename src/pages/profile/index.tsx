"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { User, Bell, Shield, Key } from 'lucide-react'
import { usePrivy } from '@privy-io/react-auth'
import DashboardLayout from '@/components/Dashboard'
import useUserStore from '@/hooks/useUserStore'
import Avatar, { genConfig } from 'react-nice-avatar'
import Image from 'next/image'

export default function UserProfilePage() {
  const { user } = usePrivy()
  const [email, setEmail] = useState<string>('test@example.com')
  const [bio, setBio] = useState("I'm a software developer passionate about creating user-friendly applications.")

  return (
    <DashboardLayout>
      <div className="flex flex-col bg-white w-full min-h-screen py-4 sm:py-20 items-center gap-2 p-2">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-center sm:space-x-4">
              <Avatar className='w-20 h-20 mb-4 sm:mb-0' {...genConfig(user?.wallet?.address || '')} />
              <div className="text-center sm:text-left">
                <CardTitle className="text-xl sm:text-2xl">{user?.github?.username}</CardTitle>
                <CardDescription className="text-sm break-all">{user?.wallet?.address}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                <TabsTrigger value="personal"><User className="mr-2 h-4 w-4" /> Personal</TabsTrigger>
                <TabsTrigger value="wallet"><Key className="mr-2 h-4 w-4" /> Wallet</TabsTrigger>
                <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4" /> Notifications</TabsTrigger>
                <TabsTrigger value="privacy"><Shield className="mr-2 h-4 w-4" /> Privacy</TabsTrigger>
              </TabsList>
              <TabsContent value="personal">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={user?.github?.username || ''} onChange={(e) => useUserStore.setState({ username: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
                  </div>
                  <Button type="submit" className="w-full">Save Changes</Button>
                </form>
              </TabsContent>
              <TabsContent value="wallet">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Manage your wallet settings</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <Label htmlFor="wallet-address" className="mb-2 sm:mb-0">Wallet Address</Label>
                    <Label htmlFor="wallet-address" className="text-sm break-all">{user?.wallet?.address}</Label>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="notifications">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <Switch id="email-notifications" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <Switch id="push-notifications" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <Switch id="sms-notifications" />
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="privacy">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Here you could verify your skills without exposing your identity</h3>
                  <div className="flex flex-col gap-4">
                    <Card className="w-full flex flex-col items-center justify-center p-4 bg-white transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-2">
                      <CardContent className="flex flex-col items-center text-center">
                        <Image
                          src="/brilliantlogo.png"
                          alt="Brilliant logo"
                          width={80}
                          height={80}
                          className="mb-4"
                        />
                        <p className="text-sm">
                          Verify your skills on Brilliant using ZkPass
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="w-full flex flex-col items-center justify-center p-4 bg-white transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-2">
                      <CardContent className="flex flex-col items-center text-center">
                        <Image
                          src="/githublogo.png"
                          alt="GitHub logo"
                          width={80}
                          height={80}
                          className="mb-4"
                        />
                        <p className="text-sm">
                          Verify your skills on GitHub using ZkPass
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
