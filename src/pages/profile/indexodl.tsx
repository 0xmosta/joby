import DashboardLayout from "@/components/Dashboard"
import Wizard from "@/components/Onboarding"
import { Button } from "@/components/ui/button"
import { usePrivy } from "@privy-io/react-auth"
import { Identity } from "@semaphore-protocol/core"
import { UserInfoResponse } from "../api/auth/user-info"
import useUserStore from "@/hooks/useUserStore"


export default function Profile() {
  const { user } = usePrivy()

  const testAPI = async () => {
    const response = await fetch('/api/auth/user-info')
    const data = await response.json() as UserInfoResponse
    console.log(data)
    useUserStore.setState({ userId: data.user?.id, userChatIdentity: data.user?.identity })
  }

  const createGroup = async () => {
    const response = await fetch('/api/chat/create-group')
    const data = await response.json()
    console.log(data)
  }

  console.log(user)
  return (
    <DashboardLayout>
      <div className="flex flex-col w-full h-full justify-center items-center gap-2 p-2">
        <Button onClick={testAPI}>
          test user credentials
        </Button>
        <Button onClick={createGroup}>
          create group
        </Button>
      </div>
    </DashboardLayout>
  )
}
