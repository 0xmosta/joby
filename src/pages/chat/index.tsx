import DashboardLayout from "@/components/Dashboard"
import useUserStore from "@/hooks/useUserStore"
import { getGroup, getMembersGroup } from "@/lib/bandadaUtils"
import { getRoot } from "@/lib/useSemaphore"
import { Identity } from "@semaphore-protocol/core"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"

export const Chat = () => {
  const [_isGroupMember, setIsGroupMember] = useState<boolean>(false)
  const [_loading, setLoading] = useState<boolean>(false)
  const [_renderInfoLoading, setRenderInfoLoading] = useState<boolean>(false)
  const [_users, setUsers] = useState<string[]>([])
  const [groupId, setGroupId] = useState<string>("")
  const [_identity, setIdentity] = useState<Identity | null>(null)

  const identityString = useUserStore((state) => state.userChatIdentity)
  const router = useRouter()
  useEffect(() => {
    setGroupId('10793119292829537713239026351489')
  }, [])


  const getUsers = useCallback(async () => {

    const users = await getMembersGroup(groupId)
    setUsers(users!.reverse())

    setRenderInfoLoading(false)

    return users
  }, [groupId])

  // Effect to load user identity and check group membership.
  useEffect(() => {

    if (!identityString) {
      router.push("/")
      return
    }

    const identity = new Identity(identityString)

    setIdentity(identity)

    async function isMember() {
      const users = await getUsers()
      const answer = users?.includes(identity!.commitment.toString())
      setIsGroupMember(answer || false)
    }

    isMember()
  }, [router, getUsers, identityString])

  const afterJoinCredentialGroup = useCallback(async () => {
    setLoading(true)

    const group = await getGroup(groupId)

    if (group === null) {
      alert("Some error ocurred! Group not found!")
      return
    }

    const groupRoot = await getRoot(group.members)

    try {
      const response = await fetch("api/join-credential", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupRoot: groupRoot.toString()
        })
      })

      if (response.status === 200) {
        setLoading(false)
        router.push("/groups")
      } else {
        alert(await response.json)
      }
    } catch (error) {
      console.log(error)

      alert("Some error occurred, please try again!")
    } finally {
      setLoading(false)
    }
  }, [groupId, router])

  const joinGroup = async () => {
    setLoading(true)

    const commitment = _identity?.commitment.toString()

    try {
      const response = await fetch("api/join-api-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId,
          commitment
        })
      })

      if (response.status === 200) {
        setIsGroupMember(true)
        const users = await getMembersGroup(groupId)
        setUsers(users!.reverse())
      } else {
        alert(await response.json)
      }
    } catch (error) {
      console.log(error)

      alert("Some error occurred, please try again!")
    } finally {
      setLoading(false)
    }
  }
  return (
    <DashboardLayout>
      <div></div>
    </DashboardLayout>
  )
}