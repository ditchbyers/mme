// /app/api/search/route.ts

import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query") ?? ""
  const apiUrl = `https://revenant.lyrica.systems/discovery/search?query=${encodeURIComponent(query)}&limit_games=4&page=1`

  const response = await fetch(apiUrl, {
    method: "GET",
  })

  const data = await response.json()
  return NextResponse.json(data)
}
