import Image from "next/image"
import { format, formatDistanceToNow } from "date-fns"

import { fetchGameDetails } from "@/lib/fetch/games"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { StarButton } from "@/components/ui/star-button"
import { TH1 } from "@/components/typography/h1"
import { TH3 } from "@/components/typography/h3"
import { GameCarousel } from "@/components/usable/games/game-carousel"
import { UserCarousel } from "@/components/usable/user/user-wrapper"

export default async function GameDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const gamedetails = await fetchGameDetails(id)
  const distance = formatDistanceToNow(new Date(gamedetails.first_release_date), {
    addSuffix: true,
  })

  const mockCovers = new Array(20).fill(gamedetails)
  return (
    <div className="mx-auto mb-36 max-w-[96rem] space-y-5 p-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-10">
        <div className="relative mx-auto aspect-[3/4] w-full max-w-[360px] min-w-[285px]">
          <Image
            src={gamedetails.cover.replace("{width}", "285").replace("{height}", "380")}
            alt={`cover-${gamedetails.identifier}`}
            className="rounded-md object-contain"
            fill
          />
        </div>
        <div className="flex-1">
          <Card className="overscroll-y-scroll mt-6 h-[480px] max-h-[480px] flex-1 md:mt-0">
            <CardHeader>
              <div className="flex items-start justify-between space-y-2">
                <CardTitle className="space-y-2">
                  <TH1>{gamedetails.name}</TH1>
                  <div className="flex gap-2">
                    <p>{format(new Date(gamedetails.first_release_date), "dd.MM.yyyy")}</p>
                    <p>({distance})</p>
                  </div>
                </CardTitle>
                <StarButton gameId={gamedetails.identifier} gameName={gamedetails.name} gameCover={gamedetails.cover} />
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-4 overflow-y-scroll">
              <h3 className="text-muted-foreground mb-1 text-sm font-semibold">Storyline</h3>
              <div className="text-justify text-sm">{gamedetails.summary}</div>
              {gamedetails.storyline && (
                <div>
                  <h3 className="text-muted-foreground mb-1 text-sm font-semibold">Storyline</h3>
                  <p className="text-sm">{gamedetails.storyline}</p>
                </div>
              )}
              {gamedetails.genres?.length > 0 && (
                <div>
                  <h3 className="text-muted-foreground mb-1 text-sm font-semibold">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {gamedetails.genres.map((genre) => (
                      <Badge key={genre} variant="secondary" className="capitalize">
                        {genre.replace(/-/g, " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {gamedetails.game_modes?.length > 0 && (
                <div>
                  <h3 className="text-muted-foreground mb-1 text-sm font-semibold">Game Modes</h3>
                  <div className="flex flex-wrap gap-2">
                    {gamedetails.game_modes.map((mode) => (
                      <Badge key={mode} variant="secondary" className="capitalize">
                        {mode.replace(/-/g, " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {gamedetails.platforms?.length > 0 && (
                <div>
                  <h3 className="text-muted-foreground mb-1 text-sm font-semibold">Platforms</h3>
                  <div className="flex flex-wrap gap-2">
                    {gamedetails.platforms.map((platform) => (
                      <Badge key={platform} variant="secondary">
                        {platform.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <TH3>Expansions</TH3>
      <GameCarousel games={mockCovers} />
      <TH3>Similar Games</TH3>
      <GameCarousel games={mockCovers} />
      <TH3>Users</TH3>
      <UserCarousel game_id={gamedetails.identifier} />
    </div>
  )
}
