export type TypoProps = React.HTMLAttributes<HTMLHeadingElement>

export type NavigationConfig = {
  mainNav: NavItem[]
  footerNav: NavItem[]
}

export type NavItem = {
  title: string
  href: string
}

interface Game {
  age_rating: number
  cover: string
  identifier: string
  name: string
  rating: number
  viewer_count: number
}
