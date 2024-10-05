import { create } from 'zustand'

export interface UserStore {
  userId: string | null
  userChatIdentity: string | null
  username: string | null
}

const useUserStore = create<UserStore>((set) => ({
  userId: null,
  userChatIdentity: null,
  username: null
}))

export default useUserStore