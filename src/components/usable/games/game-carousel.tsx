"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Game } from "@/types"

import { cn } from "@/lib/utils"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

interface GameCarouselProps {
  games: Game[]
}

export const GameCarousel: React.FC<GameCarouselProps> = ({ games }) => {
  const [touchActiveIndex, setTouchActiveIndex] = useState<number | null>(null)

  return (
    <div className="container mx-auto">
      <Carousel opts={{ align: "start", loop: true, slidesToScroll: "auto" }} draggable={false}>
        <CarouselContent className="-ml-2 pr-8 lg:pr-0">
          {games.map((game, index) => (
            <CarouselItem
              key={index}
              className={cn(
                "relative aspect-[3/4] basis-1/2 pl-2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6 xl:basis-1/8",
                "flex items-center justify-center select-none"
              )}
            >
              <Link
                href={`/games/${game.identifier}`}
                className={cn(
                  "group relative aspect-[3/4] w-full overflow-hidden transition-all duration-300 select-none hover:rounded-2xl",
                  touchActiveIndex === index && "rounded-2xl"
                )}
                onTouchStart={() => setTouchActiveIndex(index)}
                onTouchEnd={() => setTouchActiveIndex(null)}
                onTouchCancel={() => setTouchActiveIndex(null)}
              >
                <Image
                  src={game.cover.replace("{width}", "285").replace("{height}", "380")}
                  alt={game.name}
                  className={cn(
                    "cursor-pointer rounded-md object-contain transition-transform duration-300 select-none group-hover:scale-105 active:cursor-grabbing",
                    touchActiveIndex === index && "scale-105"
                  )}
                  fill
                />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute top-0 bottom-0 left-0 z-10 hidden items-center bg-gradient-to-r from-white/80 to-transparent pl-2 lg:flex">
          <CarouselPrevious className="!relative !top-auto !left-0 !-translate-y-0" />
        </div>

        <div className="absolute top-0 right-0 bottom-0 z-10 hidden items-center justify-end bg-gradient-to-l from-white/80 to-transparent pr-2 lg:flex">
          <CarouselNext className="!relative !top-auto !left-0 !-translate-y-0" />
        </div>
      </Carousel>
    </div>
  )
}
