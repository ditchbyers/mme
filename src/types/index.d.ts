export type TypoProps = React.HTMLAttributes<HTMLHeadingElement>

export type NavigationConfig = {
  mainNav: NavItem[]
  footerNav: NavItem[]
}

export type NavItem = {
  title: string
  href: string
}

export interface GameDetails extends Game {
  first_release_date: string
  summary: string
  storyline: string
  platforms: string[]
  game_modes: string[]
  genres: string[]
}

export interface Game {
  age_rating: number
  cover: string
  identifier: string
  name: string
  rating: number
  viewer_count: number
}

export interface Stream {
  genre: {
    identifier: string
    name: string
  }
  queue: Game[]
}
