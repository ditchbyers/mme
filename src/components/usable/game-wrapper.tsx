'use client'

import Image from 'next/image'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel'
import { useEffect, useState, useRef } from 'react'
import { Game } from '@/types'

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
    window.addEventListener('resize', updateSlidesToScroll)
    return () => window.removeEventListener('resize', updateSlidesToScroll)
  }, [])

  return (
    <div className="container mx-auto">
      <Carousel ref={containerRef} opts={{ align: 'start', loop: true, slidesToScroll }}>
        <CarouselContent className="-ml-2 pr-8 lg:pr-0">
          {games.map((game, index) => (
            <CarouselItem key={index} className="relative aspect-[3/4] w-full basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6">
              <Image
                src={game.box_art_url.replace('{width}', '285').replace('{height}', '380')}
                alt={game.name}
                className="object-contain rounded shadow w-full pl-2"
                fill
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden absolute left-0 top-0 bottom-0 z-10 lg:flex items-center  pl-2 bg-gradient-to-r from-white/80 to-transparent">
          <CarouselPrevious className="!relative !top-auto !-translate-y-0 !left-0" />
        </div>

        {/* Right Arrow Overlay */}
        <div className="hidden absolute right-0 top-0 bottom-0 z-10 lg:flex items-center justify-end pr-2 bg-gradient-to-l from-white/80 to-transparent">
          <CarouselNext className="!relative !top-auto !-translate-y-0 !left-0" />
        </div>
      </Carousel>
    </div>
  )
}
