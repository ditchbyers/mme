import { cache } from "react"
import { Game } from "@/types"

import { TH3 } from "@/components/typography/h3"
import { GameCarousel } from "@/components/usable/game-wrapper"

interface Stream {
  genre: {
    identifier: string
    name: string
  }
  queue: Game[]
}

const fetchStreams = cache(async (): Promise<Stream[]> => {
  const res = await fetch("https://revenant.lyrica.systems/discovery/stream", {
    method: "GET",
    headers: {
      "X-Session-Token": " _dev_skip_auth_roy",
    },
  })

  const json = await res.json()
  return json
})

export default async function Home() {
  const streams = await fetchStreams()

  return (
    <div className="container mx-auto mb-36 space-y-20 ps-5 pt-10">
      {streams.map((stream) => (
        <div key={stream.genre.identifier}>
          <TH3>{stream.genre.name}</TH3>
          <GameCarousel games={stream.queue}></GameCarousel>
        </div>
      ))}
    </div>
  )
}
