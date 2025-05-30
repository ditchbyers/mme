import Image from "next/image"
import { GameDetails } from "@/types"
import { format, formatDistanceToNow } from "date-fns"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TH1 } from "@/components/typography/h1"
import { TypographyP as P } from "@/components/typography/p"

const fetchGameDetails = async (id: string): Promise<GameDetails> => {
  const res = await fetch(`https://revenant.lyrica.systems/discovery/game/${id}`, {
    method: "GET",
    headers: {
      "X-Session-Token": "_dev_skip_auth_roy",
    },
  })

  return res.json()
}

const displayMap: Record<string, string> = {
  storyline: "Storyline",
  platforms: "Platforms",
  genres: "Genres",
  gameModes: "Game Modes",
}

export default async function GameDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const gamedetails = await fetchGameDetails(id)
  const distance = formatDistanceToNow(new Date(gamedetails.first_release_date), {
    addSuffix: true,
  })

  const accordionItems = {
    storyline: gamedetails.storyline,
    platforms: gamedetails.platforms,
    genres: gamedetails.genres,
    gameModes: gamedetails.game_modes,
  }

  return (
    <div className="container mx-auto space-y-5 p-4">
      <div className="flex flex-col gap-10 md:flex-row">
        <div className="relative mx-auto aspect-[3/4] w-[285px]">
          <Image
            src={gamedetails.cover.replace("{width}", "285").replace("{height}", "380")}
            alt={`cover-${gamedetails.identifier}`}
            className="rounded-md object-contain"
            fill
          />
        </div>
        <div className="flex-1 space-y-2">
          <TH1>{gamedetails.name}</TH1>
          <div className="flex gap-2">
            <p>{format(new Date(gamedetails.first_release_date), "yyyy-MM-dd")}</p>
            <p>({distance})</p>
          </div>
          <div className="text-justify">{gamedetails.summary}</div>
        </div>
      </div>
      <Accordion type="single" collapsible className="w-full">
        <Accordion type="multiple" className="w-full">
          {Object.entries(accordionItems).map(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0)) return null

            return (
              <AccordionItem key={key} value={key}>
                <AccordionTrigger className="rounded-none border bg-slate-100 px-3">{displayMap[key]}</AccordionTrigger>
                <AccordionContent className="px-3 py-4">
                  {Array.isArray(value) ? (
                    <ul className="list-disc space-y-1 pl-5">
                      {value.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm">{value}</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </Accordion>
      <Separator />
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Game Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            <div>
              <dt className="text-muted-foreground font-medium">Storyline</dt>
              <dd className="text-sm">{gamedetails.storyline}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground font-medium">Genres</dt>
              <dd className="text-sm">{gamedetails.genres.join(", ")}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground font-medium">Game Modes</dt>
              <dd className="text-sm">{gamedetails.game_modes.join(", ")}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground font-medium">Platforms</dt>
              <dd className="text-sm">{gamedetails.platforms.join(", ")}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
      <Separator />

      <Tabs defaultValue="storyline" className="w-full">
        <TabsList>
          <TabsTrigger value="storyline">Storyline</TabsTrigger>
          <TabsTrigger value="genres">Genres</TabsTrigger>
          <TabsTrigger value="game_modes">Modes</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
        </TabsList>

        <TabsContent value="storyline">{gamedetails.storyline}</TabsContent>
        <TabsContent value="genres">{gamedetails.genres.join(", ")}</TabsContent>
        <TabsContent value="game_modes">{gamedetails.game_modes.join(", ")}</TabsContent>
        <TabsContent value="platforms">{gamedetails.platforms.join(", ")}</TabsContent>
      </Tabs>
      <Separator />

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-muted-foreground mb-1 text-sm font-semibold">Storyline</h3>
          <p className="text-sm">{gamedetails.storyline}</p>
        </div>
        <div>
          <h3 className="text-muted-foreground mb-1 text-sm font-semibold">Genres</h3>
          <ul className="list-disc pl-5 text-sm">
            {gamedetails.genres.map((genre) => (
              <li key={genre}>{genre}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-muted-foreground mb-1 text-sm font-semibold">Game Modes</h3>
          <ul className="list-disc pl-5 text-sm">
            {gamedetails.game_modes.map((mode) => (
              <li key={mode}>{mode}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-muted-foreground mb-1 text-sm font-semibold">Platforms</h3>
          <ul className="list-disc pl-5 text-sm">
            {gamedetails.platforms.map((platform) => (
              <li key={platform}>{platform}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
