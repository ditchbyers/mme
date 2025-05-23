"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Game } from "@/types"
import { DialogDescription } from "@radix-ui/react-dialog"

import { cn } from "@/lib/utils"

import { Button } from "../ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

interface GameCarouselProps {
  games: Game[]
}

export const GameCarousel: React.FC<GameCarouselProps> = ({ games }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [slidesToScroll, setSlidesToScroll] = useState(6) // default

  useEffect(() => {
    const updateSlidesToScroll = () => {
      const width = window.innerWidth
      if (width < 640) {
        setSlidesToScroll(2)
      } else if (width < 768) {
        setSlidesToScroll(3)
      } else if (width < 1024) {
        setSlidesToScroll(4)
      } else {
        setSlidesToScroll(6)
      }
    }

    updateSlidesToScroll()
    window.addEventListener("resize", updateSlidesToScroll)
    return () => window.removeEventListener("resize", updateSlidesToScroll)
  }, [])

  return (
    <div className="container mx-auto">
      <Carousel ref={containerRef} opts={{ align: "start", loop: true, slidesToScroll }} draggable={false}>
        <CarouselContent className="-ml-2 pr-8 lg:pr-0">
          {games.map((game, index) => (
            <CarouselItem
              key={index}
              className={cn(
                "relative aspect-[3/4] basis-1/2 pl-2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6",
                "flex items-center justify-center select-none"
              )}
            >
              <Dialog>
                <DialogTrigger></DialogTrigger>
                <DialogContent>
                  <DialogTitle>Test123 </DialogTitle>
                  <DialogContent>asdf</DialogContent>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative aspect-[3/4] w-full">
                    <Image
                      src={game.box_art_url.replace("{width}", "285").replace("{height}", "380")}
                      alt={game.name}
                      className="cursor-pointer rounded-md object-contain shadow active:cursor-grabbing"
                      fill
                    />
                  </div>
                </DialogTrigger>
                <DialogContent className="">
                  <DialogHeader>
                    <DialogTitle>Details - {game.name}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex flex-row gap-4">
                      <div className="relative aspect-[3/4] w-full max-w-[285px]">
                        <Image
                          src={game.box_art_url.replace("{width}", "285").replace("{height}", "380")}
                          alt={game.name}
                          className="cursor-pointer rounded-md object-contain shadow active:cursor-grabbing"
                          fill
                        />
                      </div>
                      <div>test</div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
