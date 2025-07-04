import { UserType } from "@/types"
import { createSlice, current } from "@reduxjs/toolkit"

/**
 * Redux slice for managing user state
 * Handles current user data, authentication, and online user tracking
 * Provides actions for user management and real-time presence updates
 */
const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUserData: null,
    currentUserId: "",
    onlineUsers: [],
  },
  reducers: {
    SetCurrentUser: (state, action) => {
      state.currentUserData = action.payload
    },
    SetCurrentUserId: (state, action) => {
      state.currentUserId = action.payload
    },
    SetOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload
    },
  },
})

export const { SetCurrentUser, SetCurrentUserId, SetOnlineUsers } = userSlice.actions

export default userSlice

/**
 * Interface defining the shape of the user state
 * Used for type safety in components consuming user state
 */
export interface UserState {
  currentUserData: UserType
  currentUserId: string
  onlineUsers: string[]
}
