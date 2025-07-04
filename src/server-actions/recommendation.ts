"use server"

/**
 * Retrieves user recommendations based on similar gaming preferences
 * @param currentUserId - The ID of the current user
 * @param currentGameId - The ID of the game to base recommendations on
 * @returns Promise with recommended users data or error object
 */
export const GetSimilarUserRecommendations = async (currentUserId: any, currentGameId: any) => {
  try {
    const currentUser = currentUserId
    const currentGame = currentGameId
    const response = await fetch(
      `${process.env.DEV_URL}/recommendation/recommend/users?user_id=${currentUser}&game_id=${currentGame}`,
      {
        method: "GET",
      }
    )

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
