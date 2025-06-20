export type TypoProps = React.HTMLAttributes<HTMLHeadingElement>
export type DivProps = React.HTMLAttributes<HTMLDivElement>

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

export interface UserType {
  session_token?: string[]
  id: string
  clerkUserId: string
  name: string
  userName: string
  email: string
  profilePicture?: string
  bio?: string
  location?: string
  platforms?: string[]
  language?: string
  games?: { id: string; name: string; cover: string }[]
}

export interface ChatType {
  id: string
  users: UserType[]
  createdBy: UserType
  lastMessage?: MessageType
  isGroupChat: boolean
  groupName: string
  groupProfilePicture: string
  groupBio: string
  groupAdmins: string[]
  unreadCounts: { [userId: string]: number }
  createdAt: string
  updatedAt: string
}

export interface MessageType {
  id: string
  socketMessageId: string
  chat: ChatType
  sender: UserType
  text: string
  image: string
  readBy: UserType[]
  createdAt: string
  updatedAt: string
}

export interface recommendedUser {
  user : UserType
  score: number
}