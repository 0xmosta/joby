"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { Bell, Settings, LogOut, User, Briefcase, MessageCircle, Wallet } from "lucide-react"
import { useState } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { useRouter } from "next/router"
import Avatar, { genConfig } from "react-nice-avatar"

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { logout, user } = usePrivy()

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <header className="fixed w-full bg-gray-950 dark:bg-gray-800 dark:border-gray-700 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Image src="/JobyLogo2.png" alt="Joby Logo" width={60} height={60} />
            </Link>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-4 text-primary" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>

            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-primary relative h-8 w-8 rounded-full">
                  <Avatar className="absolute w-8 h-8" {...genConfig(user?.wallet?.address || 'test')} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem>
                  <Wallet className="mr-2 h-4 w-4" />
                  <span>{user?.wallet?.address.slice(0, 20)}...</span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/hire" className="flex items-center">
                    <Briefcase className="mr-2 h-4 w-4" />
                    <span>Hire</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/chat" className="flex items-center">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    <span>Chat</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
