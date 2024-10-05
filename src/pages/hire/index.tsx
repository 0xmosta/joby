"use client"
import Avatar, { genConfig } from 'react-nice-avatar'
import { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Star, Filter } from "lucide-react"

import DashboardLayout from "@/components/Dashboard"
const config = genConfig("hi@dapi.to")
// Placeholder data for developers
const developers = [
  { id: 1, name: "0x46533Ca9Cc95b685880F46596Ad5efE4e036FF90", specialty: "Frontend", experience: 5, description: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
  { id: 2, name: "0x5aFAAb12d773a7AC18211124Ea0771a260376592", specialty: "Backend", experience: 8, description: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
  { id: 3, name: "0xBcCd6818083ce7C3C4Dd03c2f0c464b1594D28fC", specialty: "Full Stack", experience: 6, description: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
  { id: 4, name: "0xfDe48dBc67058C6B43cB4FbbB0a0b379239B7A8b", specialty: "Mobile", experience: 4, description: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
  { id: 5, name: "0x7Db54A99dA87C4b80D5E7221F8B0e35Ca8ccEc7d", specialty: "DevOps", experience: 7, description: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
  { id: 6, name: "0x5F73AB2a86Be254454013cBc62BA4139Abe474C0", specialty: "UI/UX", experience: 5, description: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
]
export const Hire = () => {
  const [showFilters, setShowFilters] = useState(false)
  return (
    <DashboardLayout>
      <div className="flex flex-col bg-white w-full h-full justify-center items-center gap-2 p-2 pt-20">

        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-primary">Developer Directory</h1>
            <Button onClick={() => setShowFilters(!showFilters)}>
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </div>

          {showFilters && (
            <Card className="mb-6">
              <CardContent className="grid gap-6 p-6">
                <div className="grid grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {developers.map((dev) => (
              <Card key={dev.id} className="overflow-hidden">
                <CardHeader className="text-center pb-2">
                  <div className="flex justify-center mb-4">
                    <Avatar style={{ width: '8rem', height: '8rem' }} {...genConfig(dev.name)} />
                    {/* <Image
                      src={`/placeholder.svg?height=100&width=100`}
                      alt={`${dev.name}'s profile`}
                      width={100}
                      height={100}
                      className="rounded-full object-cover"
                    /> */}
                  </div>
                  <CardTitle className='truncate'>{dev.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Specialty:</strong> {dev.specialty}</p>
                  <p><strong>Experience:</strong> {dev.experience} years</p>
                  <p><strong>Description:</strong> {dev.description}</p>

                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

    </DashboardLayout>
  )
}

export default Hire