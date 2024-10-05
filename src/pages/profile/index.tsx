"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Bell, Shield, Key } from 'lucide-react'
import { usePrivy } from '@privy-io/react-auth'
import DashboardLayout from '@/components/Dashboard'
import useUserStore from '@/hooks/useUserStore'

export default function UserProfilePage() {
  const { user } = usePrivy()
  const name = useUserStore((state) => state.username || 'John Doe')
  const [email, setEmail] = useState(user?.github?.email || 'johndoe@example.com')
  const [bio, setBio] = useState("I'm a software developer passionate about creating user-friendly applications.")

  return (
    <DashboardLayout>
      <div className="flex flex-col bg-white w-full h-screen py-20 items-center gap-2 p-2">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src="/rick.jpeg" alt={name} />
                <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{name}</CardTitle>
                <CardDescription>{email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal"><User className="mr-2 h-4 w-4" /> Personal</TabsTrigger>
                <TabsTrigger value="account"><Key className="mr-2 h-4 w-4" /> Account</TabsTrigger>
                <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4" /> Notifications</TabsTrigger>
                <TabsTrigger value="privacy"><Shield className="mr-2 h-4 w-4" /> Privacy</TabsTrigger>
              </TabsList>
              <TabsContent value="personal">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
                  </div>
                  <Button type="submit">Save Changes</Button>
                </form>
              </TabsContent>
              <TabsContent value="account">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Account Settings</h3>
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button>Change Password</Button>
                </div>
              </TabsContent>
              <TabsContent value="notifications">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Preferences</h3>
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
              </TabsContent>
              <TabsContent value="privacy">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Privacy Settings</h3>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="profile-visibility">Profile Visibility</Label>
                    <Switch id="profile-visibility" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="search-visibility">Appear in Search Results</Label>
                    <Switch id="search-visibility" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="activity-visibility">Show Activity Status</Label>
                    <Switch id="activity-visibility" />
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