"use server"

import { auth } from "@clerk/nextjs/server"
import { current } from "@reduxjs/toolkit"

/**
 * Creates a new chat between users
 * @param payload - The chat data (name, participants, etc.)
 * @param currentUserId - Object containing the current user ID
 * @returns Promise with the chat data or an error
 */
export const CreateNewChat = async (payload: any, currentUserId: any) => {
  try {
    console.log("payload", payload)
    // Authenticate via Clerk and extract user ID
    const { sessionId } = await auth()
    const currentUser = currentUserId.userId

    const response = await fetch(`${process.env.DEV_URL}/chat/?user_id=${currentUser}&session_token=${sessionId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
    const data = await response.json()

    if (!response.ok) {
      console.error("Error creating chat:", data.error)
      return { error: data.error || "Unknown error occurred" }
    }
    return data
  } catch (error: any) {
    return {
      error: error.message,
    }
  }
}

/**
 * Retrieves all chats for a specific user
 * @param userId - The ID of the user
 * @returns Promise with the list of all chats or an error
 */
export const GetAllChats = async (userId: string) => {
  try {
    console.log("userId", userId)
    const response = await fetch(`${process.env.DEV_URL}/chat/${userId}/all`, {
      method: "GET",
    })

    const data = await response.json()
    if (!response.ok) {
      console.error("Error fetching chats:", data)
      return { error: data.error || "Unknown error occurred" }
    }
    return data
  } catch (error: any) {
    return {
      error: error.message,
    }
  }
}

/**
 * Retrieves specific chat data by chat ID
 * @param chatId - The unique ID of the chat
 * @returns Promise with the chat data or an error
 */
export const GetChatDataById = async (chatId: string) => {
  try {
    const response = await fetch(`${process.env.DEV_URL}/chat/${chatId}`, {
      method: "GET",
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Error fetching chat:", data.error)
      return { error: data.error || "Unknown error occurred" }
    }

    return data
  } catch (error: any) {
    return {
      error: error.message,
    }
  }
}

/**
 * Updates an existing chat
 * @param chatId - The ID of the chat to update
 * @param payload - The new chat data
 * @param currentUserId - Object containing the current user ID
 * @returns Promise with the updated chat data or an error
 */
export const UpdateChat = async ({
  chatId,
  payload,
  currentUserId,
}: {
  chatId: string
  payload: any
  currentUserId: any
}) => {
  try {
    // Authenticate and extract user ID
    const { sessionId } = await auth()
    const currentUser = currentUserId.userId
    console.log("Session ID:", sessionId)
    console.log("Current User ID:", currentUser)
    console.log("chatId:", chatId)
    
    const response = await fetch(
      `${process.env.DEV_URL}/chat/${chatId}?user_id=${currentUser}&session_token=${sessionId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error("Error updating chat:", data)
      return { error: data.error || "Unknown error occurred" }
    }

    return data
  } catch (error: any) {
    return {
      error: error.message,
    }
  }
}
