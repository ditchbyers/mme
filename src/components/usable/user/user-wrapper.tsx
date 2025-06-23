"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { CreateNewChat } from "@/server-actions/chats"
import { GetSimilarUserRecommendations } from "@/server-actions/recommendation"
import { recommendedUser, UserType } from "@/types"
import { Gamepad2, Globe, Heart, Languages, MapPin } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"

import socket from "@/config/socket-config"
import { SetChats, SetSelectedChat } from "@/lib/redux/chatSlice"
import { UserState } from "@/lib/redux/userSlice"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../ui/carousel"
import { ExpandableBio } from "./expandable-bio"
import { UserProfileGames } from "./user-profile-games"

export const UserCarousel = ({ game_id }: { game_id: any }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [recommendedUsers, setRecommendedUsers] = useState<recommendedUser[]>([])
  const { currentUserData }: UserState = useSelector((state: any) => state.user)
  const chats = useSelector((state: any) => state.chat.chats)
  const dispatch = useDispatch()
  const router = useRouter()

  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [selectedScore, setSelectedScore] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchRecommendations = async () => {
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
      setRecommendedUsers(mapped)
    }
    fetchRecommendations()
  }, [currentUserData, game_id])

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

  const handleUserClick = (user: recommendedUser) => {
    setSelectedUser(user.user)
    setSelectedScore(user.score)
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
                  <Button
                    variant={"ghost"}
                    className="hover:bg-muted/50 flex h-auto w-full cursor-pointer flex-col items-center space-y-2 p-2 transition-colors"
                    onClick={() => handleUserClick(user)}
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

      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
          <DialogContent className="max-h-[80vh] overflow-y-auto lg:min-w-5xl xl:min-w-6xl 2xl:min-w-7xl">
            <DialogHeader>
              <Card className="gap-3 py-3">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                    <Avatar className="ring-border size-32 shadow-lg ring-2">
                      <AvatarImage
                        src={selectedUser.profilePicture || "/placeholder.svg"}
                        alt={selectedUser.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gray-200 text-2xl font-bold">
                        {selectedUser.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 text-center sm:text-left">
                      <DialogTitle className="mb-1 text-3xl font-bold text-gray-900">{selectedUser.name}</DialogTitle>
                      <p className="mb-4 text-lg text-gray-600">@{selectedUser.userName}</p>

                      <Button
                        onClick={() => onAddToChat(selectedUser.id!)}
                        className="rounded-full px-8 py-2 font-medium text-white transition-colors disabled:opacity-50"
                      >
                        Start to Chat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DialogHeader>
            {selectedUser.bio && (
              <Card className="gap-3 py-3">
                <CardHeader>
                  <CardTitle className="text-xl">About</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="p-6">
                  <ExpandableBio bio={selectedUser.bio} maxLength={200} className="leading-relaxed text-gray-700" />
                </CardContent>
              </Card>
            )}
            {/* Basic Info */}
            <Card className="gap-3 py-3">
              <CardHeader>
                <CardTitle className="text-xl">Basic Information</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {location && (
                    <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      <div>
                        <h3 className="font-medium text-gray-900">Server Location</h3>
                        <p className="text-sm text-gray-700">{selectedUser.location}</p>
                      </div>
                    </div>
                  )}

                  {selectedUser.language && (
                    <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                      <Languages className="h-5 w-5 text-gray-600" />
                      <div>
                        <h3 className="font-medium text-gray-900">Language</h3>
                        <p className="text-sm text-gray-700">{selectedUser.language}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            {/* Platforms */}
            {selectedUser.platforms && selectedUser.platforms.length > 0 && (
              <Card className="gap-3 py-3">
                <CardHeader>
                  <CardTitle className="text-xl">Platforms</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.platforms.map((platform: string) => (
                      <Badge key={platform} variant="outline" className="flex items-center gap-1">
                        <Gamepad2 className="h-3 w-3" />
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Games */}
            {selectedUser.games && selectedUser.games.length > 1 && <UserProfileGames games={selectedUser.games} />}
          </DialogContent>
        </Dialog>
      )}
    </>
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
