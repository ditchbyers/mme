import { UserType } from "@/types"
import { createSlice, current } from "@reduxjs/toolkit"

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

export interface UserState {
  currentUserData: UserType
  currentUserId: string
  onlineUsers: string[]
}
