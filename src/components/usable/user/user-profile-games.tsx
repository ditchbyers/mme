"use client"

import { useState } from "react"
import Image from "next/image"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

/**
 * User profile games component for displaying a user's favorite games
 * Features search functionality, responsive grid layout, and game cover images
 * Includes empty state handling and interactive game cards
 *
 * @param games - Array of game objects containing id, name, and cover image
 * @returns JSX element containing the games section with search and grid display
 */
export function UserProfileGames({
  games,
}: {
  games: {
    id: string
    name: string
    cover: string
  }[]
}) {
  const [gameSearchQuery, setGameSearchQuery] = useState("")

  const filteredGames =
    games?.filter((game: any) => game.name.toLowerCase().includes(gameSearchQuery.toLowerCase())) || []

  return (
    <Card className="gap-3 py-3">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl">Favorite Games ({filteredGames.length})</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              type="text"
              placeholder="Search games..."
              value={gameSearchQuery}
              onChange={(e) => setGameSearchQuery(e.target.value)}
              className="py-2 pr-4 pl-10 text-sm"
            />
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-6">
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
            {filteredGames.map((game: any) => (
              <div
                key={game.id}
                className="group relative aspect-[3/4] overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-lg"
              >
                <Image
                  src={game.cover?.replace("{width}", "150").replace("{height}", "200") || "/placeholder.svg"}
                  alt={game.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="text-gray-500">No games found matching "{gameSearchQuery}"</p>
            <Button
              variant="ghost"
              onClick={() => setGameSearchQuery("")}
              className="mt-2 text-blue-600 hover:text-blue-700"
            >
              Clear search
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
