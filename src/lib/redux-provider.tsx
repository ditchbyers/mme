"use client"

import React from "react"
import { Provider } from "react-redux"

import store from "@/lib/redux/store"

/**
 * Redux Provider wrapper component for the application
 * Provides Redux store access to all child components
 *
 * @param children - React components that need access to Redux store
 * @returns JSX element wrapping children with Redux Provider
 */
function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>
}

export default ReduxProvider
