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
import { Filter } from "lucide-react"

import DashboardLayout from "@/components/Dashboard"

// Placeholder data for developers
const developers = [
  { id: 'did:privy:cm1whutm00504114f06sfb7fh', address: "0x46533Ca9Cc95b685880F46596Ad5efE4e036FF90", description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
  { id: 'did:privy:cm1whutm00504114f06sfb7fh', address: "0x5aFAAb12d773a7AC18211124Ea0771a260376592", description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
  { id: 'did:privy:cm1whutm00504114f06sfb7fh', address: "0xBcCd6818083ce7C3C4Dd03c2f0c464b1594D28fC", description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
  { id: 'did:privy:cm1whutm00504114f06sfb7fh', address: "0xfDe48dBc67058C6B43cB4FbbB0a0b379239B7A8b", description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
  { id: 'did:privy:cm1whutm00504114f06sfb7fh', address: "0x7Db54A99dA87C4b80D5E7221F8B0e35Ca8ccEc7d", description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.' },
  { id: 'did:privy:cm1whutm00504114f06sfb7fh', address: "0x5F73AB2a86Be254454013cBc62BA4139Abe474C0", description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos.' },
]

export const Hire = () => {

  const [showFilters, setShowFilters] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const cardRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (cardRef.current) {
        const cardHeight = cardRef.current.offsetHeight
        const scrollPosition = window.scrollY
        const newIndex = Math.round(scrollPosition / cardHeight)
        setCurrentIndex(newIndex)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <DashboardLayout>
      <div className="flex flex-col bg-white w-full h-full">
        <div className="fixed top-0 left-0 right-0 z-10 bg-white p-4 shadow-md">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center"
          >
            <Filter className="mr-2" /> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>

        {showFilters && (
          <Card className="mt-16 mx-4 mb-4">
            <CardContent className="grid gap-4 p-4">
              <div className="grid gap-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Select>
                  <SelectTrigger id="specialty">
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
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
                <Label htmlFor="experience">Minimum Experience (years)</Label>
                <Input type="number" id="experience" placeholder="0" min="0" />
              </div>
              <div className="grid gap-2">
                <Label>Price Range (per month)</Label>
                <Slider defaultValue={[0, 10000]} max={10000} step={500} />
              </div>
              <div className="grid gap-2">
                <Label>Minimum Rating</Label>
                <Slider defaultValue={[0]} max={5} step={0.1} />
              </div>
              <Button>Apply Filters</Button>
            </CardContent>
          </Card>
        )}

        <div className="mt-16 snap-y snap-mandatory overflow-y-scroll h-[calc(100vh-4rem)]">
          {developers.map((dev, index) => (
            <div
              key={dev.address}
              className="snap-start h-[calc(100vh-4rem)] flex items-center justify-center p-4"
              ref={index === currentIndex ? cardRef : null}
            >
              <Link href={`/p/${dev.address}`} passHref>
                <Card className="w-full max-w-sm cursor-pointer transition-transform duration-200 hover:scale-105">
                  <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                      <Avatar style={{ width: '8rem', height: '8rem' }} {...genConfig(dev.address)} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p><strong>Summary:</strong> {dev.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Hire
