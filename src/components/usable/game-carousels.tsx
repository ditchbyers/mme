"use client"

import { useSearchParams } from "next/navigation"
import { Game } from "@/types"

import { TH3 } from "@/components/typography/h3"
import { GameCarousel } from "@/components/usable/game-wrapper"

interface GameCarouselProps {
  data: Game[]
}

export default function ClientGamePage({ data }: GameCarouselProps) {
  const searchParams = useSearchParams()
  const query = searchParams.get("query")?.toLowerCase() || ""

  const filteredGames = data.filter((game) => game.name.toLowerCase().includes(query))

  if (filteredGames.length === 0) {
    return (
      <p className="mt-4 text-center text-gray-500">
        No games found for <span className="font-bold text-gray-950">{query}</span>
      </p>
    )
  }

  return (
    <div className="container mx-auto">
      {query ? (
        <>
          <TH3>Search Results</TH3>
          <GameCarousel games={filteredGames} />
        </>
      ) : (
        <div className="space-y-5">
          <div className="space-y-2">
            <TH3 className="select-none">Most Watched</TH3>
            <GameCarousel games={data} />
          </div>
          <div className="space-y-2">
            <TH3 className="select-none">Recommended</TH3>
            <GameCarousel games={data} />
          </div>
          <div className="space-y-2">
            <TH3 className="select-none">New and Spicy</TH3>
            <GameCarousel games={data} />
          </div>
        </div>
      )}
    </div>
  )
}
