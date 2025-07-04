import { cache } from "react"
import { GameDetails, Stream, UserType } from "@/types"

import { SearchResponse } from "@/components/usable/navigation/header-search"

/**
 * Fetches game streams organized by genres from the discovery API
 * Uses React cache for performance optimization
 *
 * @returns Promise resolving to an array of Stream objects containing game data by genre
 */
export const fetchStreams = cache(async (): Promise<Stream[]> => {
  const res = await fetch("https://revenant.lyrica.systems/discovery/stream", {
    method: "GET",
    headers: {
      "X-Session-Token": "_dev_skip_auth_roy",
    },
  })
  return await res.json()
})

/**
 * Fetches detailed information for a specific game
 * Retrieves comprehensive game data including metadata, media, and related games
 *
 * @param id - Unique identifier of the game to fetch
 * @returns Promise resolving to GameDetails object with complete game information
 */
export const fetchGameDetails = async (id: string): Promise<GameDetails> => {
  const res = await fetch(`https://revenant.lyrica.systems/discovery/game/${id}`, {
    method: "GET",
    headers: {
      "X-Session-Token": "_dev_skip_auth_roy",
    },
  })

  return res.json()
}

/**
 * Fetches user profile information by Clerk user ID
 * Retrieves complete user data including preferences, games, and profile details
 * 
 * @param id - Clerk user ID to fetch profile information for
 * @returns Promise resolving to UserType object with user profile data
 */
export const fetchUserInfo = async (id: string): Promise<UserType> => {
  const res = await fetch(`https://revenant.lyrica.systems/user/self/profile?clerk_user_id=${id}`, { method: "GET" })

  return res.json()
}

/**
 * Searches for users and games based on a query string
 * Provides unified search functionality across the application
 * 
 * @param query - Search term to find matching users and games
 * @returns Promise resolving to SearchResponse containing arrays of matching users and games
 */
export async function searchContent(query: string): Promise<SearchResponse> {
  const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`)
  return res.json()
}
