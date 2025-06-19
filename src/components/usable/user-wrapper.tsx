"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { SetChats, SetSelectedChat } from "@/redux/chatSlice"
import { UserState } from "@/redux/userSlice"
import { CreateNewChat } from "@/server-actions/chats"
import { GetSimilarUserRecommendations } from "@/server-actions/recommendation"
import { UserType } from "@/types"
import { useDispatch, useSelector } from "react-redux"

import socket from "@/config/socket-config"
import { cn } from "@/lib/utils"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"
import { HeartButtonSimple } from "../ui/heart-button-user"

export const UserCarousel = ({ game_id }: { game_id: any }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [slidesToScroll, setSlidesToScroll] = useState(6)
  const [recommendedUsers, setRecommendedUsers] = useState<UserType[]>([])
  const { currentUserData }: UserState = useSelector((state: any) => state.user)
  const chats = useSelector((state: any) => state.chat.chats)
  const dispatch = useDispatch()
  const router = useRouter()

  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchRecommendations = async () => {
      console.log("currentUserData, game_id", currentUserData, game_id)
      if (!currentUserData?.id || !game_id) return
      const rec = await GetSimilarUserRecommendations(currentUserData.id, game_id)
      console.log("rec", rec)
      setRecommendedUsers(Array.isArray(rec) ? rec : [])
    }
    fetchRecommendations()
  }, [currentUserData, game_id])

  useEffect(() => {
    const updateSlidesToScroll = () => {
      const width = window.innerWidth
      if (width <= 640) setSlidesToScroll(2)
      else if (width <= 768) setSlidesToScroll(3)
      else if (width <= 1280) setSlidesToScroll(4)
      else setSlidesToScroll(6)
    }
    updateSlidesToScroll()
    window.addEventListener("resize", updateSlidesToScroll)
    return () => window.removeEventListener("resize", updateSlidesToScroll)
  }, [])

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
        <Carousel ref={containerRef} opts={{ align: "start", loop: true, slidesToScroll }} draggable={false}>
          <CarouselContent className="-ml-2 pr-8 lg:pr-0">
            {recommendedUsers.map((user, index) => (
              <CarouselItem
                key={index}
                className={cn(
                  "relative basis-1/2 pl-2 sm:basis-1/3 md:basis-1/4 xl:basis-1/6",
                  "flex justify-center select-none"
                )}
              >
                <div className="relative flex w-full max-w-xs flex-col items-center rounded-md bg-white p-4 shadow-md">
                  <div className="absolute top-3 right-3">
                    <HeartButtonSimple userId={user.id} />
                  </div>

                  <div
                    onClick={() => setSelectedUser(user)}
                    className="relative mb-4 h-24 w-24 cursor-pointer overflow-hidden rounded-full border-2 border-gray-300"
                  >
                    <Image
                      src={user.profilePicture || "/image.png"}
                      alt={user.userName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <p className="text-center text-lg font-semibold text-gray-900">{user.userName}</p>
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
        <div className="fixed top-1/2 left-1/2 z-[9999] flex max-h-[calc(100vh-5rem)] w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform flex-col overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
          <button
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            onClick={() => setSelectedUser(null)}
            aria-label="Close Modal"
          >
            ✕
          </button>

          <div className="flex flex-col items-center">
            <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-gray-300">
              <Image
                src={selectedUser.profilePicture || "/image.png"}
                alt={selectedUser.userName}
                fill
                className="object-cover"
              />
            </div>
            <h2 className="mb-2 text-2xl font-bold">{selectedUser.userName}</h2>
          </div>

          <div className="my-4 w-full border-t border-gray-300" />

          <div className="mt-5 flex flex-grow flex-col gap-4 overflow-auto">
            {getProperty("Location", selectedUser.location || "")}
            {getProperty("Language", selectedUser.language || "")}
            {getProperty(
              "Games",
              selectedUser?.games ? selectedUser.games.map((game) => game.name).join(", ") || "" : ""
            )}
            {getProperty("Platforms", selectedUser?.platforms ? selectedUser.platforms.join(", ") : "")}
            {getProperty("Bio", selectedUser.bio || "")}
          </div>
          <button
            disabled={loading}
            onClick={() => onAddToChat(selectedUser.id!)}
            className="mt-6 rounded bg-gray-600 px-4 py-2 font-semibold text-white hover:bg-gray-500 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Start to Chat"}
          </button>
        </div>
      )}
    </>
  )
}
