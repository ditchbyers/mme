import { cache } from "react"
import { Game } from "@/types"

import ClientGamePage from "@/components/usable/game-carousels"

interface GamesResponseProps {
  data: Game[]
  pagination: {
    cursor: string
  }
}

const fetchToken = cache(async (): Promise<string> => {
  const res = await fetch("http:localhost:3000/api/twitch/token", {
    method: "POST",
  })
  const json = await res.json()
  return json.access_token as string
})

const fetchGames = cache(async (token: string): Promise<GamesResponseProps> => {
  const res = await fetch(`http:localhost:3000/api/twitch/games?token=${token}`)
  return res.json()
})

const fetchGameDetails = cache(async (token: string): Promise<GamesResponseProps> => {
  const res = await fetch(`http:localhost:3000/api/twitch/games-details?token=${token}`)
  return res.json()
})

export default async function Home() {
  const token = await fetchToken()
  const games = await fetchGames(token)
  const gamedetails = await fetchGameDetails(token)

  return (
    <div className="container mx-auto mb-36 space-y-20 ps-5 pt-10">
      <ClientGamePage data={games.data} />
    </div>
  )
}
