"use client"

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

// Placeholder data for developers
const developers = [
  { id: 1, name: "Alice Johnson", specialty: "Frontend", experience: 5, rating: 4.8, price: 5000 },
  { id: 2, name: "Bob Smith", specialty: "Backend", experience: 8, rating: 4.9, price: 7000 },
  { id: 3, name: "Charlie Brown", specialty: "Full Stack", experience: 6, rating: 4.7, price: 6000 },
  { id: 4, name: "Diana Ross", specialty: "Mobile", experience: 4, rating: 4.6, price: 4500 },
  { id: 5, name: "Ethan Hunt", specialty: "DevOps", experience: 7, rating: 4.8, price: 6500 },
  { id: 6, name: "Fiona Apple", specialty: "UI/UX", experience: 5, rating: 4.7, price: 5500 },
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
                    <Image
                      src={`/placeholder.svg?height=100&width=100`}
                      alt={`${dev.name}'s profile`}
                      width={100}
                      height={100}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <CardTitle>{dev.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Specialty:</strong> {dev.specialty}</p>
                  <p><strong>Experience:</strong> {dev.experience} years</p>
                  <p><strong>Rating:</strong> {dev.rating} <Star className="inline-block w-4 h-4 fill-yellow-400 stroke-yellow-400" /></p>
                  <p><strong>Avg. Price/Month:</strong> ${dev.price}</p>
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