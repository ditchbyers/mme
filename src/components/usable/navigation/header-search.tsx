"use client"

import * as React from "react"
import { Search } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Game = {
  type: "game"
  id: string
  name: string
  imageUrl: string
}

type User = {
  type: "user"
  id: string
  username: string
  profileImage: string
}

type SearchItem = Game | User

export function SearchCommandPopover() {
  const [searchValue, setSearchValue] = React.useState("")
  const [open, setOpen] = React.useState(false)
  const [data, setData] = React.useState<SearchItem[]>([])
  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Simulate data fetching
  React.useEffect(() => {
    // Replace with actual API call
    const fetchData = async () => {
      const result: SearchItem[] = [
        {
          type: "game",
          id: "game1",
          name: "League of Legends",
          imageUrl: "/_next/image?url=https%3A%2F%2Fstatic-cdn.jtvnw.net%2Fttv-boxart%2F21779-285x380.jpg&w=3840&q=75",
        },
        {
          type: "game",
          id: "game2",
          name: "Valorant",
          imageUrl: "/_next/image?url=https%3A%2F%2Fstatic-cdn.jtvnw.net%2Fttv-boxart%2F21779-285x380.jpg&w=3840&q=75",
        },
        {
          type: "game",
          id: "game3",
          name: "Elden Ring",
          imageUrl: "/_next/image?url=https%3A%2F%2Fstatic-cdn.jtvnw.net%2Fttv-boxart%2F21779-285x380.jpg&w=3840&q=75",
        },
        {
          type: "user",
          id: "user1",
          username: "pascal",
          profileImage:
            "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJ4dWJRTmtkTFlUdEZ0TWhNWmVEZFVicXNHRyJ9",
        },
        {
          type: "user",
          id: "user2",
          username: "mitch",
          profileImage:
            "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJ4dWJRTmtkTFlUdEZ0TWhNWmVEZFVicXNHRyJ9",
        },
        {
          type: "user",
          id: "user3",
          username: "lisa",
          profileImage:
            "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJ4dWJRTmtkTFlUdEZ0TWhNWmVEZFVicXNHRyJ9",
        },
      ]
      setData(result)
    }

    fetchData()
  }, [])

  React.useEffect(() => {
    setOpen(searchValue.length > 0)
  }, [searchValue])

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  // Filtering the API data based on searchValue
  const filteredGames = React.useMemo(
    () =>
      data.filter(
        (item): item is Game => item.type === "game" && item.name.toLowerCase().includes(searchValue.toLowerCase())
      ),
    [data, searchValue]
  )

  const filteredUsers = React.useMemo(
    () =>
      data.filter(
        (item): item is User => item.type === "user" && item.username.toLowerCase().includes(searchValue.toLowerCase())
      ),
    [data, searchValue]
  )

  const handleSearch = (query: string) => {
    setSearchValue(query)
    setOpen(false)
    console.log("Searching for:", query)
  }

  return (
    <div className="mx-auto w-full">
      <div className="relative" ref={containerRef}>
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            ref={inputRef}
            placeholder="Search games or users..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="bg-secondary h-12 py-3 pr-4 pl-10 text-base"
          />
        </div>

        {open && (
          <div className="absolute top-full right-0 left-0 z-50 mt-1">
            <div className="bg-popover text-popover-foreground rounded-md border p-0 shadow-md outline-none">
              <div className="max-h-80 overflow-y-auto">
                {filteredGames.length === 0 && filteredUsers.length === 0 ? (
                  <div className="text-muted-foreground p-4 text-center">
                    <Search className="mx-auto mb-2 h-8 w-8" />
                    <p>No results found</p>
                    <p className="text-sm">Try a different search term</p>
                  </div>
                ) : (
                  <div className="space-y-2 p-2">
                    {filteredGames.length > 0 && (
                      <div>
                        <div className="text-muted-foreground px-2 py-1.5 text-sm font-medium">
                          Games ({filteredGames.length})
                        </div>
                        {filteredGames.map((game) => (
                          <Button
                            key={game.id}
                            variant="ghost"
                            className="hover:bg-muted h-auto w-full justify-start p-3 text-left font-normal"
                            onClick={() => handleSearch(game.name)}
                          >
                            <div className="flex items-center gap-3">
                              {/* 3:4 aspect ratio wrapper */}
                              <div className="relative aspect-[3/4] w-8">
                                <img
                                  src={game.imageUrl}
                                  alt={game.name}
                                  className="absolute inset-0 h-full w-full object-cover"
                                />
                              </div>
                              <span className="font-medium">{game.name}</span>
                            </div>
                          </Button>
                        ))}
                      </div>
                    )}

                    {filteredUsers.length > 0 && (
                      <div>
                        <div className="text-muted-foreground px-2 py-1.5 text-sm font-medium">
                          Users ({filteredUsers.length})
                        </div>
                        {filteredUsers.map((user) => (
                          <Button
                            key={user.id}
                            variant="ghost"
                            className="hover:bg-muted h-auto w-full justify-start p-3 text-left font-normal"
                            onClick={() => handleSearch(user.username)}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.profileImage} alt={user.username} />
                                <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{user.username}</span>
                            </div>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
