"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChevronRight, ChevronLeft, Check } from "lucide-react"

export default function Wizard() {
  const [step, setStep] = useState(1)
  const [userRole, setUserRole] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [bio, setBio] = useState("")

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", { userRole, name, email, bio })
    // Here you would typically send the data to your backend
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= i ? "bg-primary text-primary-foreground" : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                }`}
              >
                {step > i ? <Check className="w-5 h-5" /> : i}
              </div>
              {i < 3 && (
                <div
                  className={`h-1 w-16 sm:w-32 ${
                    step > i ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Select Your Role</h2>
            <RadioGroup value={userRole} onValueChange={setUserRole}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="developer" id="developer" />
                <Label htmlFor="developer">Developer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="customer" id="customer" />
                <Label htmlFor="customer">Customer</Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Additional Information</h2>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
                rows={4}
              />
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          {step > 1 && (
            <Button type="button" onClick={handleBack} variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          )}
          {step < 3 ? (
            <Button type="button" onClick={handleNext} className="ml-auto">
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" className="ml-auto">
              Submit
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
