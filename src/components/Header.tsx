"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { Bell, Settings, LogOut, User, Briefcase } from "lucide-react"
import { useState } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { useRouter } from "next/router"

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { logout } = usePrivy()

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <header className="fixed w-full bg-green-950 dark:bg-gray-800 dark:border-gray-700 z-10">
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
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/rick.jpeg" alt="User avatar" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
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
                  <Link href="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
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