"use client"
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function CardSelectionPage() {
  const router = useRouter()

  const handleCardClick = (path: string) => {
    router.push(path)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        <Card 
          className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 bg-gray-800 border-gray-700"
          onClick={() => handleCardClick('/devstep1')}
        >
          <CardHeader>
            <CardTitle className="text-white">Developer</CardTitle>
            <CardDescription className="text-gray-400">Select this option if you are looking for a job</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">Your github will be rated then you could proceed to your profile.</p>
          </CardContent>
        </Card>
        <Card 
          className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 bg-gray-800 border-gray-700"
          onClick={() => handleCardClick('/hire')}
        >
          <CardHeader>
            <CardTitle className="text-white">Customer</CardTitle>
            <CardDescription className="text-gray-400">Select this option if you're looking for developers</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">You will be able to find developers fit for your need.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
