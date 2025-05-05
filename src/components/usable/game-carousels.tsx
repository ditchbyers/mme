'use client'

import { useSearchParams } from 'next/navigation'
import { GameCarousel } from '@/components/usable/game-wrapper'
import { TH3 } from '@/components/typography/h3'
import { Game } from '@/types'

interface GameCarouselProps {
  data: Game[]
}

export default function ClientGamePage({ data }: GameCarouselProps) {
  const searchParams = useSearchParams()
  const query = searchParams.get('query')?.toLowerCase() || ''

  const filteredGames = data.filter((game) => game.name.toLowerCase().includes(query))

  if (filteredGames.length === 0) {
    return <p className="text-center text-gray-500 mt-4">No games found for {query}</p>
  }

  return (
    <div className="container mx-auto">
      {query ? (
        <>
          <TH3>Search Results</TH3>
          <GameCarousel games={filteredGames} />
        </>
      ) : (
        <>
          <TH3>Most Watched</TH3>
          <GameCarousel games={data} />
          <TH3>Recommended</TH3>
          <GameCarousel games={data} />
          <TH3>New and Spicy</TH3>
          <GameCarousel games={data} />
        </>
      )}
    </div>
  )
}
