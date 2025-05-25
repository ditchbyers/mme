// app/api/twitch/user/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 })
  }

  const clientId = process.env.TWITCH_CLIENT_ID!
  const res = await fetch("https://api.twitch.tv/helix/games/top?first=50", {
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await res.json()
  if (!res.ok) {
    return NextResponse.json(
      { error: "Helix API failed", details: data },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}
