"use server"

import { auth, currentUser } from "@clerk/nextjs/server"

/**
 * Retrieves or creates the current user in MongoDB from Clerk authentication
 * @returns Promise with the user data from MongoDB or an error
 */
export const GetCurrentUserFromMongoDB = async () => {
  try {
    // Authenticate user and get session data from Clerk
    const { sessionId, userId } = await auth()
    const clerkUser = await currentUser()

    if (!clerkUser) {
      return { error: "User not authenticated." }
    }
    
    let email = ""
    if (clerkUser?.emailAddresses) {
      email = clerkUser?.emailAddresses[0]?.emailAddress || ""
    }

    const newUserPayload = {
      session_token: [sessionId],
      clerkUserId: clerkUser?.id,
      name: [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" "),
      userName: clerkUser?.username,
      email,
      profilePicture: clerkUser?.imageUrl,
    }

    const response = await fetch(`${process.env.DEV_URL}/user/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUserPayload),
    })

    const data = await response.json()


    if (!response.ok) {
      console.error("Error creating user:", data.error)
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
 * Updates the current user's profile information
 * @param currentUserId - The ID of the current user
 * @param payload - The updated profile data
 * @returns Promise with the updated user data or an error
 */
export const UpdateUserProfile = async (currentUserId: any, payload: any) => {
  try {
    // Authenticate and get session data
    const { sessionId } = await auth()
    const currentUser = currentUserId
    

    const response = await fetch(
      `${process.env.DEV_URL}/user/self/profile?user_id=${currentUser}&session_token=${sessionId}`,
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
      console.error("Error updating user:", data.error)
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
 * Retrieves all user profiles from the system
 * @returns Promise with array of all user profiles or an error
 */
export const GetAllUsers = async () => {
  try {
    // Make API call to fetch all user profiles
    const response = await fetch(`${process.env.DEV_URL}/user/profiles`, {
      method: "GET",
    })

    const data = await response.json()
    if (!response.ok) {
      console.error("Error fetching users:", data.error)
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
 * Retrieves all users that have existing chats with the current user
 * @param currentUserId - The ID of the current user
 * @returns Promise with array of users with existing chats or an error
 */
export const GetAllUsersExistingChat = async (currentUserId: any) => {
  try {
    const currentUser = currentUserId
    const response = await fetch(`${process.env.DEV_URL}/user/all/chat/profile?user_id=${currentUser}`, {
      method: "GET",
    })

    const data = await response.json()
    if (!response.ok) {
      console.error("Error fetching users:", data.error)
      return { error: data.error || "Unknown error occurred" }
    }
    return data
  } catch (error: any) {
    return {
      error: error.message,
    }
  }
}
