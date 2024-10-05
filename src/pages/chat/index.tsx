"use client"

import { use, useEffect, useState } from 'react'
import Avatar, { genConfig } from 'react-nice-avatar'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Menu } from "lucide-react"
import DashboardLayout from '@/components/Dashboard'
import { decodeBytes32String, toBeHex } from 'ethers'
import { usePrivy } from '@privy-io/react-auth'

type Chat = {
  id: number
  name: string
  lastMessage: string
  timestamp: string
  description: string
}

type Message = {
  id: number
  sender: string
  content: string
  timestamp: string
}

// Placeholder data for chats
const chats = [
  { id: 1, name: "Alice Smith", lastMessage: "Hey, how are you?", timestamp: "10:30 AM" },
  { id: 2, name: "Bob Johnson", lastMessage: "Can we meet tomorrow?", timestamp: "Yesterday" },
  { id: 3, name: "Charlie Brown", lastMessage: "Thanks for your help!", timestamp: "2 days ago" },
  { id: 4, name: "Diana Ross", lastMessage: "Let's discuss the project", timestamp: "3 days ago" },
]

// Placeholder data for messages
// const messages = [
//   { id: 1, sender: "Alice Smith", content: "Hey, how are you?", timestamp: "10:30 AM" },
//   { id: 2, sender: "You", content: "I'm good, thanks! How about you?", timestamp: "10:31 AM" },
//   { id: 3, sender: "Alice Smith", content: "I'm doing well too. Did you finish the report?", timestamp: "10:32 AM" },
//   { id: 4, sender: "You", content: "Yes, I just sent it over. Let me know if you need any changes.", timestamp: "10:33 AM" },
// ]

export default function ChatPage() {
  const { user } = usePrivy()
  const [chatList, setChatList] = useState<Chat[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [showSidebar, setShowSidebar] = useState(false)
  const [messages, setMessages] = useState<any[]>([])

  useEffect(() => {

    const fetchChatList = async () => {
      try {
        const response = await fetch("api/chat/list", {
          method: "GET",
        })
        const data = await response.json()
        setChatList(data.groups)
        console.log(data)
      } catch (error) {
        console.error(`error`, error)
      }
    }
    fetchChatList()

  }, [])

  const sendMessage = async (message: string) => {
    if (!selectedChat) return
    try {
      const response = await fetch("api/chat/send-message", {
        method: "POST",
        body: JSON.stringify({
          groupId: selectedChat.id,
          messageToSend: message,
        })
      })
      const data = await response.json()
      console.log(data)
    } catch (error) {
      console.error(`error`, error)
    }
  }

  useEffect(() => {

    const fetchMessage = async () => {
      if (selectedChat) {
        try {
          const response = await fetch(`/api/chat/get-messages?groupId=${selectedChat.id}`, {
            method: "GET",
          })
          const messages = await response.json() as any[]
          const messagesArray = messages.map((message) => ({
            id: message.id,
            sender: message.sender,
            content: decodeBytes32String(toBeHex(message.message)),
            timestamp: message.timestamp,
          }))
          setMessages(messagesArray)

          console.log(messagesArray);
        } catch (error) {
          console.error(`error`, error)
        }
      }
    }

    fetchMessage()
  }, [selectedChat])


  return (
    <DashboardLayout>
      <div className="flex h-screen pt-16 bg-white">
        {/* Sidebar */}
        <div className={`bg-white w-full sm:w-64 fixed inset-y-0 left-0 transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'} sm:relative sm:translate-x-0 transition duration-200 ease-in-out z-10`}>
          <div className="p-4 border-b">
            <h2 className="text-2xl font-semibold text-primary">Chats</h2>
          </div>
          <ScrollArea className="h-[calc(100vh-5rem)]">
            {chatList.map((chat) => (
              <div
                key={chat.id}
                className={`p-4 cursor-pointer hover:bg-gray-100 ${selectedChat?.id === chat.id ? 'bg-gray-100' : ''}`}
                onClick={() => {
                  setSelectedChat(chat)
                  setShowSidebar(false)
                }}
              >
                <div className="flex items-center space-x-4">

                  <Avatar style={{ width: '40px', height: '40px' }} {...genConfig(chat.name)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{chat.name}</p>
                    <p className="text-sm text-gray-500 truncate">{chat.description}</p>
                  </div>
                  {/* <span className="text-xs text-gray-400">{chat.timestamp}</span> */}
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="bg-white border-b p-4 flex items-center justify-between">
            <Button variant="ghost" size="icon" className="sm:hidden text-primary" onClick={() => setShowSidebar(!showSidebar)}>
              <Menu className="h-6 w-6" />
            </Button>
            <h3 className="text-xl font-semibold text-primary">{selectedChat?.name || "Select someone to chat with"}</h3>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No messages yet</p>
              </div>
            ) :
              messages.map((message, index) => (
                <div key={`index-${index}`} className={`flex ${message.sender === user?.id ? 'justify-end' : 'justify-start'} mb-4`}>
                  <Card className={`max-w-[70%] ${message.sender === user?.id ? 'bg-primary text-white' : 'bg-white'}`}>
                    <CardContent className="p-3">
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 ${message.sender === user?.id ? 'text-blue-100' : 'text-gray-400'}`}>{message.timestamp}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
          </ScrollArea>

          {/* Message input */}
          <div className="bg-white border-t p-4">
            <form className="flex space-x-2" onSubmit={(e) => {
              e.preventDefault()
              sendMessage(messageInput)
              setMessageInput('')

            }}>
              <Input className="flex-1 text-primary"
                onChange={(e) => setMessageInput(e.target.value)}
                value={messageInput}
                placeholder="Type a message..." />
              <Button type="submit">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>

  )
}