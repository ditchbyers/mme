// /app/api/search/route.ts

import { NextRequest, NextResponse } from "next/server"

/**
 * API route handler for game search functionality
 * Proxies search requests to the external game discovery API
 * 
 * @param req - The incoming Next.js request object containing search parameters
 * @returns Promise resolving to a JSON response with search results
 */
export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query") ?? ""
  const apiUrl = `https://revenant.lyrica.systems/discovery/search?query=${encodeURIComponent(query)}&limit_games=4&page=1`

  const response = await fetch(apiUrl, {
    method: "GET",
  })

  const data = await response.json()
  return NextResponse.json(data)
}
