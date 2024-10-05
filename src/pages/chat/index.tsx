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
    let intervalId: NodeJS.Timeout
    
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

    if (selectedChat) {
      fetchMessage(); // Fetch messages immediately when a chat is selected
      intervalId = setInterval(fetchMessage, 1000); // Then fetch every second
    }
  
  }, [selectedChat])

  return (
    <DashboardLayout>
      <div className="flex h-screen pt-16 bg-gray-900 text-white">
        {/* Sidebar */}
        <div className={`bg-gray-800 w-full sm:w-64 fixed inset-y-0 left-0 transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'} sm:relative sm:translate-x-0 transition duration-200 ease-in-out`}>
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-2xl font-semibold text-primary">Chats</h2>
          </div>
          <ScrollArea className="h-[calc(100vh-5rem)]">
            {chatList.map((chat) => (
              <div
                key={chat.id}
                className={`p-4 cursor-pointer hover:bg-gray-700 ${selectedChat?.id === chat.id ? 'bg-gray-700' : ''}`}
                onClick={() => {
                  setSelectedChat(chat)
                  setShowSidebar(false)
                }}
              >
                <div className="flex items-center space-x-4">
                  <Avatar style={{ width: '40px', height: '40px' }} {...genConfig(chat.name)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-100 truncate">{chat.name}</p>
                    <p className="text-sm text-gray-400 truncate">{chat.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col bg-gray-900">
          {/* Chat header */}
          <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
            <Button variant="ghost" size="icon" className="sm:hidden text-primary" onClick={() => setShowSidebar(!showSidebar)}>
              <Menu className="h-6 w-6" />
            </Button>
            <h3 className="text-xl font-semibold text-primary">{selectedChat?.name || "Select someone to chat with"}</h3>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">No messages yet</p>
              </div>
            ) :
              messages.map((message, index) => (
                <div key={`index-${index}`} className={`flex ${message.sender === user?.id ? 'justify-end' : 'justify-start'} mb-4`}>
                  <Card className={`max-w-[70%] ${message.sender === user?.id ? 'bg-primary text-white' : 'bg-gray-800 text-white'}`}>
                    <CardContent className="p-3">
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 ${message.sender === user?.id ? 'text-blue-200' : 'text-gray-400'}`}>{message.timestamp}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
          </ScrollArea>

          {/* Message input */}
          <div className="bg-gray-800 border-t border-gray-700 p-4">
            <form className="flex space-x-2" onSubmit={(e) => {
              e.preventDefault()
              sendMessage(messageInput)
              setMessageInput('')
            }}>
              <Input 
                className="flex-1 text-white bg-gray-700 border-gray-600 focus:border-primary"
                onChange={(e) => setMessageInput(e.target.value)}
                value={messageInput}
                placeholder="Type a message..." 
              />
              <Button type="submit" className="bg-primary hover:bg-primary/80 text-white">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
