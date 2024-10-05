"use client"

import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function CardSelectionPage() {
  const router = useRouter()

  const handleCardClick = (path: string) => {
    router.push(path)
  }

  return (
    <div className="min-h-screenflex items-center justify-center p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        <Card 
          className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
          onClick={() => handleCardClick('/devstep1')}
        >
          <CardHeader>
            <CardTitle>Developer</CardTitle>
            <CardDescription>Select this option if you are looking for a job</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Your github will be rated then you could proceed to you profile.</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
          onClick={() => handleCardClick('/hire')}
        >
          <CardHeader>
            <CardTitle>Customer</CardTitle>
            <CardDescription>Select this option if you looking for developers</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You will be able to find developers fit for your need.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
