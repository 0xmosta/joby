import DashboardLayout from "@/components/Dashboard"
import { Button } from "@/components/ui/button"
import { usePrivy } from "@privy-io/react-auth"
import {
  decodeBytes32String,
  toBeHex
} from "ethers"

import { ApiSdk } from "@bandada/api-sdk"
import { Invite } from "@bandada/api-sdk"

import { Identity, Group, generateProof } from "@semaphore-protocol/core"

import { useState } from "react"
import { getGroup, getMembersGroup } from "@/lib/bandadaUtils"


export default function ChatSetup() {
  const { user } = usePrivy()

  const [_invite, _setInvite] = useState<Invite>()
  const [_group, _setGroup] = useState<Group>()
  const [identity, setIdentity] = useState<Identity>(new Identity(user?.customMetadata!.identity as string))

  const createGroup = async () => {

    const response = await fetch("api/chat/create-group", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: user?.id,
        description: 'test',
      })
    })
  }


  const join_group = async () => {
    const apiSdk = new ApiSdk()
    if (!_invite) {
      throw new Error("Invite not found")
    }

    const group = await apiSdk.getGroup(_invite?.group.id)

    console.log(`invite`, _invite)
    console.log(`user`, user)
    console.log(`group`, group)

    await apiSdk.addMemberByInviteCode(
      group.id,
      identity?.commitment as unknown as string,
      _invite?.code
    )

    console.log(`joined group`)
  }


  const get_group_info = async () => {
    if (!_invite) {
      throw new Error("Invite not found")
    }
    const apiSdk = new ApiSdk()
    const group = await apiSdk.getGroup(_invite?.group.id)
    console.log(`group`, group)
  }


  const getUserGroups = async () => {
    const response = await fetch("api/chat/list", {
      method: "GET",
    })
    const data = await response.json()
    console.log(`data`, data)
  }

  const sendMessage = async (messageToSend: string) => {
    try {
      const response = await fetch("api/chat/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageToSend: "Hello, world!",
        })
      })
    } catch (error) {
      console.error(`error`, error)
    }
  }

  const getMessages = async () => {
    try {
      const response = await fetch("api/chat/get-messages", {
        method: "GET",
      })
      const messages = await response.json() as any[]
      messages.forEach((message) => {
        const decoded = decodeBytes32String(toBeHex(message.message))
        console.log(decoded)
      })
    } catch (error) {
      console.error(`error`, error)
    }

  }


  return (
    <DashboardLayout>
      <div className="flex flex-col w-full h-full justify-center items-center gap-2 p-20">

        <Button onClick={() => createGroup()}>Create Group</Button>

        <Button onClick={() => join_group()}>Join Group</Button>

        <Button onClick={() => get_group_info()}>Get Group Info</Button>

        <Button onClick={() => getUserGroups()}>Get User Groups Info</Button>

        <Button onClick={() => sendMessage("test")}>Send message</Button>
        <Button onClick={getMessages}>get messages</Button>



      </div>
    </DashboardLayout>
  )
}
