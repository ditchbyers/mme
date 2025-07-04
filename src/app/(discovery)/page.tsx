import { fetchStreams } from "@/lib/fetch/games"
import { TH3 } from "@/components/typography/h3"
import { GameCarousel } from "@/components/usable/games/game-carousel"

/**
 * Home page component for game discovery
 * Displays game streams organized by genres in carousel format
 * Each genre section shows a collection of games in a horizontal scrollable carousel
 *
 * @returns JSX element containing genre-based game carousels
 */
export default async function Home() {
  const streams = await fetchStreams()

  return (
    <div className="container mx-auto space-y-10 ps-5 pt-10 md:px-6">
      {streams.map((stream) => (
        <div key={stream.genre.identifier} className="space-y-2">
          <TH3>{stream.genre.name}</TH3>
          <GameCarousel games={stream.queue}></GameCarousel>
        </div>
      ))}
    </div>
  )
}
