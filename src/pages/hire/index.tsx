"use client"
import Avatar, { genConfig } from 'react-nice-avatar'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Filter, Loader2 } from "lucide-react"
import axios from 'axios'

import DashboardLayout from "@/components/Dashboard"

const BACKEND_URL = "https://joby-backend.fly.dev"

export const Hire = () => {
  const [showFilters, setShowFilters] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [developers, setDevelopers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const cardRef = useRef(null)

  useEffect(() => {
    fetchDevelopers()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (cardRef.current) {
        const cardHeight = cardRef.current['offsetHeight'] 
        const scrollPosition = window.scrollY
        const newIndex = Math.round(scrollPosition / cardHeight)
        setCurrentIndex(newIndex)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fetchDevelopers = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${BACKEND_URL}/developers/`)
      setDevelopers(response.data)
      setIsLoading(false)
    } catch (err) {
      console.error('Error fetching developers:', err)
      setError('Failed to fetch developers. Please try again later.')
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen bg-gray-900">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen bg-gray-900">
          <p className="text-red-400">{error}</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col bg-gray-900 w-full h-full text-white">


        {showFilters && (
          <Card className="mt-16 mx-4 mb-4 bg-gray-800 border-gray-700">
            <CardContent className="grid gap-4 p-4">
              <div className="grid gap-2">
                <Label htmlFor="specialty" className="text-gray-300">Specialty</Label>
                <Select>
                  <SelectTrigger id="specialty" className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="frontend">Frontend</SelectItem>
                    <SelectItem value="backend">Backend</SelectItem>
                    <SelectItem value="fullstack">Full Stack</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                    <SelectItem value="devops">DevOps</SelectItem>
                    <SelectItem value="uiux">UI/UX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="experience" className="text-gray-300">Minimum Experience (years)</Label>
                <Input type="number" id="experience" placeholder="0" min="0" className="bg-gray-700 border-gray-600 text-white" />
              </div>
              <div className="grid gap-2">
                <Label className="text-gray-300">Price Range (per month)</Label>
                <Slider defaultValue={[0, 10000]} max={10000} step={500} className="bg-gray-700" />
              </div>
              <div className="grid gap-2">
                <Label className="text-gray-300">Minimum Rating</Label>
                <Slider defaultValue={[0]} max={5} step={0.1} className="bg-gray-700" />
              </div>
              <Button className="bg-primary hover:bg-primary/80">Apply Filters</Button>
            </CardContent>
          </Card>
        )}

        <div className="mt-16 snap-y snap-mandatory overflow-y-scroll h-[calc(100vh-4rem)]">
          {developers.map((dev: { address: string; bio: string }, index) => (
            <div
              key={dev.address}
              className="snap-start h-[calc(100vh-4rem)] flex items-center justify-center p-4"
              ref={index === currentIndex ? cardRef : null}
            >
              <Link href={`/p/${dev.address}`} passHref>
                <Card className="w-full max-w-sm cursor-pointer transition-transform duration-200 hover:scale-105 bg-gray-800 border-gray-700">
                  <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                      <Avatar style={{ width: '8rem', height: '8rem' }} {...genConfig(dev.address)} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300"><strong className="text-white">Summary:</strong> {dev.bio}</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}        </div>
      </div>
    </DashboardLayout>
  )
}

export default Hire
