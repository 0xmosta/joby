import { useRouter } from 'next/router'
import Avatar, { genConfig } from 'react-nice-avatar'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mail, Copy, MessageCircle } from "lucide-react"
import { useState } from 'react'

const DeveloperDetailPage = () => {
  const router = useRouter()
  const { address } = router.query
  const [showCopiedAlert, setShowCopiedAlert] = useState(false)

  const handleBack = () => {
    router.back()
  }

  const handleContact = async () => {
    try { 
      const response = await fetch('/api/chat/create-group', {
        method: 'POST',
        body: JSON.stringify({
          name: address,
          description: 'chat with a potential hire',
          personToContact: 'did:privy:cm1whutm00504114f06sfb7fh',
        })
      })

      router.push('/chat')
    } catch (error) {
      console.error(error)
    }
  }

  const handleCopyAddress = () => {
    if (address && typeof address === 'string') {
      navigator.clipboard.writeText(address)
      setShowCopiedAlert(true)
      setTimeout(() => setShowCopiedAlert(false), 2000)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center">
          <div className="mb-4">
            <Avatar style={{ width: '8rem', height: '8rem' }} {...genConfig(address as string)} />
          </div>
          <CardTitle className="text-2xl font-bold">Developer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-700 break-all mr-2">
              <span className="font-semibold">Address:</span> {address}
            </p>
            <Button variant="outline" size="icon" onClick={handleCopyAddress}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col space-y-4">
            <Button onClick={handleContact} className="w-full">
              <MessageCircle className="mr-2 h-4 w-4" /> Contact This Person
            </Button>
            <Button variant="outline" onClick={handleBack} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DeveloperDetailPage
