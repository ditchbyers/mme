import { configureStore } from "@reduxjs/toolkit"

import chatSlice from "./chatSlice"
import userSlice from "./userSlice"

/**
 * Redux store configuration combining all application slices
 * Manages global application state for user and chat functionality
 * Provides centralized state management with Redux Toolkit
 */
const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    chat: chatSlice.reducer,
  },
})

export default store
