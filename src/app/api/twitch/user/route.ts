// app/api/twitch/user/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  }

  const clientId = process.env.TWITCH_CLIENT_ID!
  const res = await fetch('https://api.twitch.tv/helix/games/top?first=50', {
    headers: {
      'Client-ID': clientId,
      Authorization: `Bearer ${token}`,
    },
  })

  const response = await fetch('https://api.igdb.com/v4/games', {
    method: 'POST',
    headers: {
      'Client-ID': clientId,
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    body: `fields age_ratings,aggregated_rating,aggregated_rating_count,alternative_names.*,artworks.*,bundles,category,checksum,collection,collections,cover,created_at,dlcs,expanded_games,expansions,external_games,first_release_date,follows,forks,franchise,franchises,game_engines,game_localizations,game_modes,game_status,game_type,genres,hypes,involved_companies,keywords,language_supports,multiplayer_modes,name,parent_game,platforms,player_perspectives,ports,rating,rating_count,release_dates,remakes,remasters,screenshots,similar_games,slug,standalone_expansions,status,storyline,summary,tags,themes,total_rating,total_rating_count,updated_at,url,version_parent,version_title,videos,websites;
      where name = "League of Legends";
    `,
  })

  const data = await res.json()
  if (!res.ok) {
    return NextResponse.json({ error: 'Helix API failed', details: data }, { status: 500 })
  }

  return NextResponse.json(data)
}
