import Image from "next/image"
import localFont from "next/font/local"
import { usePrivy } from '@privy-io/react-auth'
import { Button } from "@/components/ui/button"

export default function Home() {
  const { login } = usePrivy()

  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center">
      <Button variant='default' onClick={() => login({ loginMethods: ['github', 'wallet'] })}>
        Login
      </Button>
    </div>

  )
}
