import Image from "next/image"
import { format, formatDistanceToNow } from "date-fns"

import { fetchGameDetails, searchContent } from "@/lib/fetch/games"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { StarButton } from "@/components/ui/star-button"
import { TH1 } from "@/components/typography/h1"
import { TH3 } from "@/components/typography/h3"
import { GameCarousel } from "@/components/usable/games/game-carousel"
import { UserCarousel } from "@/components/usable/user/user-wrapper"

/**
 * Game details page component
 * Displays comprehensive information about a specific game including cover art,
 * description, genres, platforms, expansions, similar games, and recommended users
 *
 * @param params - Route parameters containing the game ID
 * @param params.id - The unique identifier of the game to display
 * @returns JSX element containing the complete game details layout
 */
export default async function GameDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const gamedetails = await fetchGameDetails(id)
  const distance = formatDistanceToNow(new Date(gamedetails.first_release_date), {
    addSuffix: true,
  })

  console.log(gamedetails)

  return (
    <div className="container mx-auto min-h-screen space-y-12 p-6 pb-36">
      {/* Hero Section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Game Cover */}
        <div className="lg:col-span-4">
          <div className="sticky top-6">
            <div className="group hover:shadow-3xl relative mx-auto aspect-[3/4] w-full max-w-[400px] overflow-hidden rounded-2xl shadow-2xl transition-all duration-300">
              <Image
                src={gamedetails.cover.replace("{width}", "400").replace("{height}", "533")}
                alt={`cover-${gamedetails.identifier}`}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                fill
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          </div>
        </div>
        {/* Game Information */}
        <div className="lg:col-span-8">
          <Card className="bg-card/50 border-0 shadow-xl backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <TH1 className="leading-tight">{gamedetails.name}</TH1>
                  <div className="text-muted-foreground flex flex-wrap items-center gap-3">
                    <time className="text-sm font-medium">
                      {format(new Date(gamedetails.first_release_date), "MMMM dd, yyyy")}
                    </time>
                    <span className="text-xs">•</span>
                    <span className="text-sm">Released {distance}</span>
                    {gamedetails.rating && (
                      <>
                        <span className="text-xs">•</span>
                        <span className="text-sm font-medium text-green-600">{gamedetails.rating.toFixed(1)}/100</span>
                      </>
                    )}
                  </div>
                </div>
                <StarButton gameId={gamedetails.identifier} gameName={gamedetails.name} gameCover={gamedetails.cover} />
              </div>
            </CardHeader>
            <Separator className="mx-6" />
            <CardContent className="space-y-8 pt-6">
              {/* Summary */}
              <div className="space-y-3">
                <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">Summary</h3>
                <p className="text-foreground/90 text-sm leading-relaxed">{gamedetails.summary}</p>
              </div>

              {/* Storyline */}
              {gamedetails.storyline && (
                <div className="space-y-3">
                  <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">Storyline</h3>
                  <p className="text-foreground/90 text-sm leading-relaxed">{gamedetails.storyline}</p>
                </div>
              )}

              {/* Game Details Grid */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {/* Genres */}
                {gamedetails.genres?.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {gamedetails.genres.map((genre) => (
                        <Badge
                          key={genre}
                          variant="secondary"
                          className="bg-primary/10 text-primary hover:bg-primary/20 capitalize transition-colors"
                        >
                          {genre.replace(/-/g, " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Game Modes */}
                {gamedetails.game_modes?.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">Game Modes</h3>
                    <div className="flex flex-wrap gap-2">
                      {gamedetails.game_modes.map((mode) => (
                        <Badge key={mode} variant="outline" className="hover:bg-muted/50 capitalize transition-colors">
                          {mode.replace(/-/g, " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Platforms */}
                {gamedetails.platforms?.length > 0 && (
                  <div className="space-y-3 sm:col-span-2 lg:col-span-1 xl:col-span-2">
                    <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">Platforms</h3>
                    <div className="flex flex-wrap gap-2">
                      {gamedetails.platforms.map((platform) => (
                        <Badge
                          key={platform}
                          variant="secondary"
                          className="bg-accent/50 text-accent-foreground hover:bg-accent/70 transition-colors"
                        >
                          {platform.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Age Ratings */}
                {gamedetails.age_rating.length > 0 && (
                  <div className="space-y-3 sm:col-span-2 lg:col-span-1 xl:col-span-2">
                    <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">Age Rating</h3>
                    <div className="flex flex-wrap gap-3">
                      {gamedetails.age_rating.map((rating, index) => {
                        // Determine if this is an ESRB rating (typically rectangular)
                        const isESRB = rating.agency.toLowerCase() === "esrb"

                        return (
                          <div
                            key={index}
                            className="group relative flex max-w-16 min-w-0 flex-col items-center space-y-2"
                          >
                            <div
                              className={`relative overflow-hidden bg-white/5 backdrop-blur-sm transition-all duration-300 ${isESRB ? "h-20 w-16" : "h-16 w-16"} `}
                            >
                              <Image
                                src={rating.icon || "/placeholder.svg?height=80&width=80"}
                                alt={`${rating.agency} ${rating.name}`}
                                className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
                                fill
                                sizes={isESRB ? "64px" : "64px"}
                              />
                            </div>
                            <div className="flex max-w-[80px] flex-col items-center space-y-1">
                              <span className="text-muted-foreground/80 text-center text-[10px] leading-tight">
                                {rating.location}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="space-y-12">
        {/* Expansions */}
        {gamedetails.expansions.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <TH3 className="text-2xl font-bold">Expansions</TH3>
              <div className="from-border h-px flex-1 bg-gradient-to-r to-transparent" />
            </div>
            <div className="bg-card/30 rounded-xl p-6 backdrop-blur-sm">
              <GameCarousel games={gamedetails.expansions} />
            </div>
          </section>
        )}

        {/* Similar Games */}
        {gamedetails.similar_games.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <TH3 className="text-2xl font-bold">Similar Games</TH3>
              <div className="from-border h-px flex-1 bg-gradient-to-r to-transparent" />
            </div>
            <div className="bg-card/30 rounded-xl p-6 backdrop-blur-sm">
              <GameCarousel games={gamedetails.similar_games} />
            </div>
          </section>
        )}

        {/* Users */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <TH3 className="text-2xl font-bold">Recommended User</TH3>
            <div className="from-border h-px flex-1 bg-gradient-to-r to-transparent" />
          </div>
          <div className="bg-card/30 rounded-xl p-6 backdrop-blur-sm">
            <UserCarousel game_id={gamedetails.identifier} />
          </div>
        </section>
      </div>
    </div>
  )
}
