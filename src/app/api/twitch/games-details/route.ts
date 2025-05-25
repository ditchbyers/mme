// app/api/twitch/user/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 })
  }

  const clientId = process.env.TWITCH_CLIENT_ID!
  const res = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: `fields 
      age_ratings.*,
      aggregated_rating,
      aggregated_rating_count,
      alternative_names.*,
      artworks.*,
      bundles,
      category,
      checksum,
      collections,
      cover.*,
      created_at,
      dlcs,
      expanded_games,
      expansions,
      external_games,
      first_release_date,
      forks,
      franchise,
      franchises,
      game_engines,
      game_localizations,
      game_modes,
      game_status,
      game_type,
      genres,
      hypes,
      keywords.*,
      language_supports.language.name,
      language_supports.language.locale,
      multiplayer_modes,
      name,parent_game,
      platforms,
      player_perspectives,
      ports,
      rating,
      rating_count,
      release_dates,
      remakes,remasters,
      screenshots,
      similar_games.name,
      slug,
      standalone_expansions,
      storyline,
      summary,
      tags,
      themes,
      total_rating,
      total_rating_count,
      updated_at,
      url,
      version_parent,
      version_title,
      videos,
      websites.*;
      where name = "Valorant";
    `,
  })

  const data = await res.json()
  if (!res.ok) {
    return NextResponse.json({ error: "Helix API failed", details: data }, { status: 500 })
  }

  return NextResponse.json(data)
}
