"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { CreateNewChat } from "@/server-actions/chats"
import { GetSimilarUserRecommendations } from "@/server-actions/recommendation"
import { recommendedUser, UserType } from "@/types"
import { Gamepad2, Globe, Heart, MapPin } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"

import socket from "@/config/socket-config"
import { SetChats, SetSelectedChat } from "@/lib/redux/chatSlice"
import { UserState } from "@/lib/redux/userSlice"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ScoreBar from "@/components/ui/score-bar"
import { Separator } from "@/components/ui/separator"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../ui/carousel"
import { HeartButtonSimple } from "../../ui/heart-button-user"

export const UserCarousel = ({ game_id }: { game_id: any }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [recommendedUsers, setRecommendedUsers] = useState<recommendedUser[]>([])
  const { currentUserData }: UserState = useSelector((state: any) => state.user)
  const chats = useSelector((state: any) => state.chat.chats)
  const dispatch = useDispatch()
  const router = useRouter()

  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(false)
  const selectedScore = selectedUser ? (recommendedUsers.find((r) => r.user.id === selectedUser.id)?.score ?? 0) : 0

  useEffect(() => {
    const fetchRecommendations = async () => {
      console.log("currentUserData, game_id", currentUserData, game_id)
      if (!currentUserData?.id || !game_id) return
      const rec = await GetSimilarUserRecommendations(currentUserData.id, game_id)
      const mapped = rec.map((r: any) => ({
        user: {
          id: r.id,
          clerkUserId: r.clerkUserId,
          name: r.name,
          userName: r.userName,
          email: r.email,
          profilePicture: r.profilePicture,
          bio: r.bio,
          location: r.location,
          platforms: r.platforms,
          language: r.language,
          games: r.games,
          session_token: r.session_token,
        },
        score: r.score,
      }))
      console.log("Recommended Users:", mapped)
      setRecommendedUsers(mapped)
    }
    fetchRecommendations()
  }, [currentUserData, game_id])

  const getProperty = (key: string, value: string) => {
    return (
      <div className="flex flex-col">
        <span className="font-semibold text-gray-700">{key}</span>
        <span className="text-gray-600">{value}</span>
      </div>
    )
  }

  const onAddToChat = async (userId: string) => {
    try {
      setLoading(true)

      const existingChat = chats.find((chat: any) => {
        if (!chat.users) return false
        const chatUserIds = chat.users.map((u: any) => u.id || u)

        return chatUserIds.length === 2 && chatUserIds.includes(userId) && chatUserIds.includes(currentUserData.id)
      })

      if (existingChat) {
        dispatch(SetSelectedChat(existingChat))
        router.push(`/chat`)
        setSelectedUser(null)
        return
      }

      const response = await CreateNewChat(
        {
          users: [userId, currentUserData.id],
          createdBy: currentUserData.id!,
          isGroupChat: false,
        },
        { userId: currentUserData.id }
      )

      if (response.error) throw new Error(response.error)

      socket.emit("create-new-chat", {
        chat: response,
        senderId: currentUserData.id,
      })

      dispatch(SetChats([...chats, response]))
      dispatch(SetSelectedChat(response))
      setSelectedUser(null)
      router.push(`/chat`)
    } catch (error: any) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (recommendedUsers.length === 0) {
    return <p className="mt-1 text-sm text-gray-500">No recommended Users</p>
  }

  return (
    <>
      <div className="mx-auto max-w-[96rem]">
        <Carousel ref={containerRef} opts={{ align: "start", loop: true, slidesToScroll: "auto" }} draggable={false}>
          <CarouselContent className="-ml-2 pr-8 lg:pr-0">
            {recommendedUsers.map((user, index) => (
              <CarouselItem
                key={index}
                className={cn("relative basis-1/2 pl-2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6 xl:basis-1/8")}
              >
                <div className="flex w-full justify-center">
                  <UserDialog user={user} />
                </div>
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

      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="max-h-[calc(100vh-5rem)] max-w-md overflow-y-auto">
          {selectedUser && (
            <>
              <DialogHeader className="items-center">
                <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-gray-300">
                  <Image
                    src={selectedUser.profilePicture || "/image.png"}
                    alt={selectedUser.userName}
                    fill
                    className="object-cover"
                  />
                </div>
                <DialogTitle>{selectedUser.userName}</DialogTitle>
              </DialogHeader>

              <div className="my-4 w-full border-t border-gray-300" />

              <div className="mt-5 flex flex-col gap-4">
                {getProperty("Server Location", selectedUser.location || "")}
                {getProperty("Language", selectedUser.language || "")}
                {getProperty(
                  "Games",
                  selectedUser?.games ? selectedUser.games.map((game) => game.name).join(", ") || "" : ""
                )}
                {getProperty("Platforms", selectedUser?.platforms ? selectedUser.platforms.join(", ") : "")}
                {getProperty("Bio", selectedUser.bio || "")}
              </div>

              <DialogClose asChild>
                <button
                  disabled={loading}
                  onClick={() => onAddToChat(selectedUser.id!)}
                  className="mt-6 w-full rounded bg-gray-600 px-4 py-2 font-semibold text-white hover:bg-gray-500 disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Start to Chat"}
                </button>
              </DialogClose>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

function UserDialog({ user }: { user: recommendedUser }) {
  return (
    <Dialog>
      <DialogTrigger className="w-full cursor-pointer">
        <Button
          variant={"ghost"}
          className="hover:bg-muted/50 flex h-auto w-full flex-col items-center space-y-2 p-2 transition-colors"
        >
          <div className="relative">
            <Avatar className="ring-background h-16 w-16 shadow-lg ring-2">
              <AvatarImage src={user.user.profilePicture} alt={user.user.name} />
              <AvatarFallback className="text-lg font-semibold">
                {user.user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {user.score && (
              <div
                className={cn(
                  "absolute -top-1 -right-5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                  getMatchColor(user.score)
                )}
              >
                {user.score > 10 ? 10 : user.score}
              </div>
            )}
          </div>
          <div className="text-center">
            <p className="line-clamp-1 text-sm font-medium">{user.user.name}</p>
            <p className="text-muted-foreground text-xs">@{user.user.userName}</p>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto lg:min-w-5xl xl:min-w-6xl 2xl:min-w-7xl">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <Avatar className="ring-border h-20 w-20 ring-2">
              <AvatarImage src={user.user.profilePicture || "/placeholder.svg"} alt={user.user.name} />
              <AvatarFallback className="text-xl font-bold">{user.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{user.user.name}</DialogTitle>
              <p className="text-muted-foreground">@{user.user.userName}</p>
              {user.score && (
                <div className="mt-2">
                  <Badge variant="secondary" className={cn("text-sm", getMatchColor(user.score))}>
                    <Heart className="mr-1 h-3 w-3" />
                    {getMatchLabel(user.score)} ({user.score > 10 ? 10 : user.score}/10)
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Bio */}
          {user.user.bio && (
            <div>
              <h3 className="text-muted-foreground mb-2 text-sm font-semibold tracking-wide uppercase">About</h3>
              <p className="text-sm leading-relaxed">{user.user.bio}</p>
            </div>
          )}

          {/* Location & Language */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {user.user.location && (
              <div className="flex items-center gap-2">
                <MapPin className="text-muted-foreground h-4 w-4" />
                <span className="text-sm">{user.user.location}</span>
              </div>
            )}
            {user.user.language && (
              <div className="flex items-center gap-2">
                <Globe className="text-muted-foreground h-4 w-4" />
                <span className="text-sm">{user.user.language}</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Platforms */}
          {user.user.platforms && user.user.platforms.length > 0 && (
            <div>
              <h3 className="text-muted-foreground mb-3 text-sm font-semibold tracking-wide uppercase">Platforms</h3>
              <div className="flex flex-wrap gap-2">
                {user.user.platforms.map((platform) => (
                  <Badge key={platform} variant="outline" className="flex items-center gap-1">
                    <Gamepad2 className="h-3 w-3" />
                    {platform}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Games */}
          {user.user.games && user.user.games.length > 0 && (
            <div>
              <h3 className="text-muted-foreground mb-3 text-sm font-semibold tracking-wide uppercase">
                Favorite Games ({user.user.games.length})
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {user.user.games.map((game) => (
                  <div
                    key={game.id}
                    className="group relative aspect-[3/4] overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-lg"
                  >
                    <Image
                      src={game.cover.replace('{width || "/placeholder.svg"}', "150").replace("{height}", "200")}
                      alt={game.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="absolute right-2 bottom-2 left-2">
                        <p className="line-clamp-2 text-xs font-medium text-white">{game.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function getMatchColor(score: number) {
  if (score >= 8) return "text-green-500 bg-green-500/10"
  if (score >= 4) return "text-yellow-500 bg-yellow-500/10"
  return "text-red-500 bg-red-500/10"
}

function getMatchLabel(score: number) {
  if (score >= 8) return "Excellent Match"
  if (score >= 4) return "Good Match"
  return "Low Match"
}
