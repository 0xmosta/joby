import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Avatar, { genConfig } from 'react-nice-avatar'
import { ArrowLeft, Mail, Copy, ExternalLink, Star, X, Loader2 } from "lucide-react"
import { Progress } from "@/components/Progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { usePrivy } from "@privy-io/react-auth"
import { TransitiveTrustGraph } from "@ethereum-attestation-service/transitive-trust-sdk"
import axios from 'axios'
import DashboardLayout from '@/components/Dashboard'

interface Edge {
  id: string
  src: string
  dst: string
  score: number
}

interface TrustScore {
  positiveScore: number
  negativeScore: number
  netScore: number
}

interface Developer {
  address: string
  bio: string
}

const BACKEND_URL = "https://joby-backend.fly.dev"

const DeveloperDetailPage = () => {
  const router = useRouter()
  const { address } = router.query
  const { user } = usePrivy()

  const [edges, setEdges] = useState<Edge[]>([])
  const [trustScores, setTrustScores] = useState<{ [key: string]: { [key: string]: TrustScore } }>({})
  const [showCopiedAlert, setShowCopiedAlert] = useState(false)
  const [trustScore, setTrustScore] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTrustScore, setNewTrustScore] = useState('')
  const [developer, setDeveloper] = useState<Developer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)
    if (address && typeof address === 'string') {
      fetchDeveloper(address)
      fetchEdges()
    }
  }, [address])

  const fetchDeveloper = async (address: string) => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${BACKEND_URL}/developers/${address}`)
      setDeveloper(response.data)
      setIsLoading(false)
    } catch (err) {
      console.error('Error fetching developer:', err)
      setError('Failed to fetch developer information')
      setIsLoading(false)
    }
  }

  const fetchEdges = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/edges/`)
      setEdges(response.data)
    } catch (err) {
      console.error('Error fetching edges:', err)
    }
  }

  useEffect(() => {
    if (edges.length > 0) {
      const graph = new TransitiveTrustGraph()

      edges.forEach(edge => {
        graph.addEdge(edge.src, edge.dst, edge.score, 0)
      })

      const nodes = Array.from(new Set(edges.flatMap(edge => [edge.src, edge.dst])))
      const scores: { [key: string]: { [key: string]: TrustScore } } = {}
      nodes.forEach(sourceNode => {
        scores[sourceNode] = graph.computeTrustScores(sourceNode, nodes)
      })
      setTrustScores(scores)

      if (user?.wallet?.address && address && typeof address === 'string') {
        const userScores = scores[user.wallet.address]
        if (userScores && userScores[address]) {
          setTrustScore(Math.round(userScores[address].positiveScore * 100))
        }
      }
    }
  }, [edges, user, address])

  const handleBack = () => router.back()

  const handleCopyAddress = () => {
    if (address && typeof address === 'string') {
      navigator.clipboard.writeText(address)
      setShowCopiedAlert(true)
      setTimeout(() => setShowCopiedAlert(false), 2000)
    }
  }

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setNewTrustScore('')
  }

  const handleTrustScoreSubmit = async () => {
    if (!user?.wallet?.address || !address || typeof address !== 'string') return

    const score = parseFloat(newTrustScore)
    if (isNaN(score) || score < 0 || score > 100) {
      alert('Please enter a valid score between 0 and 100')
      return
    }

    try {
      await axios.post(`${BACKEND_URL}/edges/`, {
        src: user.wallet.address,
        dst: address,
        score: score / 100 // Convert to 0-1 range
      })
      await fetchEdges() // Refetch edges to update the graph
      handleCloseModal()
    } catch (error) {
      console.error('Error updating trust score:', error)
    }
  }

  const truncateAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`

  const handleContact = async () => {
    try {
      const response = await fetch('/api/chat/create-group', {
        method: 'POST',
        body: JSON.stringify({
          name: address,
          description: 'chat with a potential hire',
          personToContact: address,
        })
      })

      router.push('/chat')
    } catch (error) {
      console.error(error)
    }
  }

  if (!isClient || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  if (error || !developer) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
          <p className="text-red-400">{error || 'Failed to load developer information'}</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4 sm:p-6">
        <Card className="w-full max-w-xl shadow-lg bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-col items-center p-6 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-t-lg">
            <div className="relative mb-4">
              {address && typeof address === 'string' && (
                <Avatar style={{ width: '7rem', height: '7rem' }} {...genConfig(address)} />
              )}
              <div className="absolute bottom-1 right-1 bg-gray-800 rounded-full p-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold mb-2 text-center">
              {address && typeof address === 'string' ? truncateAddress(address) : 'Loading...'}
            </CardTitle>
            <CardDescription className="text-gray-300 flex flex-wrap items-center justify-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleCopyAddress} className="text-gray-300 hover:text-white px-2 py-1">
                <Copy className="h-4 w-4 mr-1" />
                Copy address
              </Button>
              <span className="hidden sm:inline text-gray-500">|</span>
              {address && typeof address === 'string' && (
                <a href={`https://etherscan.io/address/${address}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center hover:text-white text-sm text-gray-300">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View on Etherscan
                </a>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-white">About</h3>
              <p className="text-gray-300 text-sm">
                {developer.bio}
              </p>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-white">Trust Score</h3>
              <div className="flex items-center mb-3">
                <Progress value={trustScore} className="flex-grow mr-4" />
                <span className="text-lg font-bold w-12 text-right text-white">{trustScore}%</span>
              </div>
              <Button onClick={handleOpenModal} className="w-full bg-primary hover:bg-primary/80 text-white">
                <Star className="mr-2 h-4 w-4" /> Rate Developer
              </Button>
            </div>
            <div className="flex flex-col gap-3">
              <Button onClick={handleContact} className="w-full bg-primary hover:bg-primary/80 text-white">
                <Mail className="mr-2 h-4 w-4" /> Contact This Person
              </Button>
              <Button variant="outline" onClick={handleBack} className="w-full border-gray-600 text-white hover:bg-gray-700">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
              </Button>
            </div>
          </CardContent>
        </Card>
        {showCopiedAlert && (
          <div className="mt-4 bg-green-800 border border-green-600 text-green-200 px-4 py-2 rounded relative text-sm" role="alert">
            <span>Address copied to clipboard!</span>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Rate Developer</h2>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-200">
                  <X className="h-6 w-4" />
                </button>
              </div>
              <p className="mb-4 text-gray-300">
                Enter a trust score between 0 and 100 for this developer.
              </p>
              <Input
                type="number"
                min="0"
                max="100"
                value={newTrustScore}
                onChange={(e) => setNewTrustScore(e.target.value)}
                placeholder="Enter score (0-100)"
                className="mb-4 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
              <div className="flex justify-end gap-2">
                <Button onClick={handleCloseModal} variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
                  Cancel
                </Button>
                <Button onClick={handleTrustScoreSubmit} className="bg-primary hover:bg-primary/80 text-white">
                  Submit
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default DeveloperDetailPage
