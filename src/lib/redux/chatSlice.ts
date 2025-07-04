import { ChatType } from "@/types"
import { createSlice } from "@reduxjs/toolkit"

/**
 * Redux slice for managing chat state
 * Handles chat list, selected chat, and chat-related operations
 * Provides actions for setting chats, selecting chats, and clearing selection
 */
const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    selectedChat: null,
  },
  reducers: {
    SetChats: (state, action) => {
      state.chats = action.payload
    },
    SetSelectedChat: (state, action) => {
      state.selectedChat = action.payload
    },
    clearSelectedChat: (state) => {
      state.selectedChat = null
    },
  },
})

export const { SetChats, SetSelectedChat, clearSelectedChat } = chatSlice.actions
export default chatSlice

/**
 * Interface defining the shape of the chat state
 * Used for type safety in components consuming chat state
 */
export interface ChatState {
  chats: ChatType[]
  selectedChat: ChatType | null
}
