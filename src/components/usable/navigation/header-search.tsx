"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Gamepad2, Search, Star, User } from "lucide-react"

import { searchContent } from "@/lib/fetch/games"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

export interface SearchUser {
  clerkUserId: string
  username: string
  profilePicture: string
}

export interface SearchGame {
  identifier: string
  cover: string
  name: string
  rating: number
  viewer_count: number
}

export interface SearchResponse {
  users: SearchUser[]
  games: SearchGame[]
}
/**
 * Header search component providing global search functionality
 * Enables searching for users and games with real-time results
 * Features debounced search, dropdown results, and navigation integration
 *
 * @returns JSX element containing the search input with dropdown results
 */
export function HeaderSearch() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)
  const [isSearching, setIsSearching] = React.useState(false)
  const [searchResults, setSearchResults] = React.useState<SearchResponse>({ users: [], games: [] })
  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const router = useRouter()

  const debouncedSearch = React.useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults({ users: [], games: [] })
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    try {
      const results = await searchContent(query)
      setSearchResults(results)
    } catch (error) {
      console.error("Search failed:", error)
      setSearchResults({ users: [], games: [] })
    } finally {
      setIsSearching(false)
    }
  }, [])

  React.useEffect(() => {
    const timer = setTimeout(() => {
      debouncedSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, debouncedSearch])

  // Open dropdown when there's a search query
  React.useEffect(() => {
    setIsOpen(searchQuery.length > 0)
  }, [searchQuery])

  // Handle click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLinkClick = () => {
    setIsOpen(false)
    setSearchQuery("")
    setSearchResults({ users: [], games: [] })
    setIsSearching(false)
  }

  const handleInputFocus = () => {
    if (searchQuery.length > 0) {
      setIsOpen(true)
    }
  }

  return (
    <div className="bg-popover relative mx-auto w-full rounded-md" ref={containerRef}>
      <div className="relative">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search users and games..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleInputFocus}
          className="bg-muted/50 focus-visible:ring-primary/20 h-12 border-0 pr-4 pl-10 text-base focus-visible:ring-2"
        />
      </div>

      {isOpen && searchQuery && (
        <div className="absolute top-full right-0 left-0 z-50 mt-1">
          <div className="bg-popover text-popover-foreground max-h-96 overflow-y-auto rounded-md border shadow-md">
            {isSearching && (
              <div className="text-muted-foreground py-8 text-center">
                <div className="border-primary mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"></div>
                <p className="text-sm">Searching...</p>
              </div>
            )}

            {!isSearching && searchResults.users.length === 0 && searchResults.games.length === 0 && (
              <div className="text-muted-foreground py-8 text-center">
                <Search className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p className="text-sm font-medium">No results found</p>
                <p className="text-xs">Try searching for different users or games</p>
              </div>
            )}

            {!isSearching && searchResults.users.length > 0 && (
              <div className="p-2">
                <h3 className="text-muted-foreground mb-2 px-2 text-sm font-medium">Users</h3>
                <div className="space-y-1">
                  {searchResults.users.map((user) => (
                    <Link
                      href={`/user/${user.clerkUserId}`}
                      key={user.clerkUserId}
                      onClick={handleLinkClick}
                      className="hover:bg-accent flex cursor-pointer items-center space-x-3 rounded-lg p-3 transition-colors"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profilePicture || "/placeholder.svg"} alt={user.username} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-sm text-white">
                          {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{user.username}</p>
                        <p className="text-muted-foreground text-xs">User Profile</p>
                      </div>
                      <User className="text-muted-foreground h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {!isSearching && searchResults.games.length > 0 && (
              <div className="p-2">
                <h3 className="text-muted-foreground mb-2 px-2 text-sm font-medium">Games</h3>
                <div className="space-y-1">
                  {searchResults.games.map((game) => (
                    <Link
                      href={`/games/${game.identifier}`}
                      key={game.identifier}
                      onClick={handleLinkClick}
                      className="hover:bg-accent flex cursor-pointer items-center space-x-3 rounded-lg p-3 transition-colors"
                    >
                      <div className="bg-muted relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={
                            game.cover.replace('{width || "/placeholder.svg"}', "96").replace("{height}", "128") ||
                            "/placeholder.svg"
                          }
                          alt={`${game.name} cover`}
                          className="object-cover"
                          fill
                          sizes="48px"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg?height=48&width=48"
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{game.name}</p>
                        <div className="text-muted-foreground flex items-center space-x-2 text-xs">
                          {game.rating > 0 && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{game.rating.toFixed(1)}</span>
                            </div>
                          )}
                          {game.viewer_count > 0 && <span>{game.viewer_count.toLocaleString()} viewers</span>}
                        </div>
                      </div>
                      <Gamepad2 className="text-muted-foreground h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
