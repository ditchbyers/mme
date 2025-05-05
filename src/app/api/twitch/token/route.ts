// app/api/auth/token/route.ts
import { NextResponse } from 'next/server'

export async function POST() {
  const clientId = process.env.TWITCH_CLIENT_ID!
  const clientSecret = process.env.TWITCH_CLIENT_SECRET!

  // Build form data
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
  })

  // Request token from Twitch
  const res = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    body,
  })

  const data = await res.json()
  if (!res.ok) {
    return NextResponse.json({ error: 'Token fetch failed', details: data }, { status: 500 })
  }

  // Return the token JSON (access_token, expires_in, token_type)
  return NextResponse.json(data)
}
