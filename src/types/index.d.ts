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
  id: string
  name: string
  box_art_url: string
  igdb_id: string
}
