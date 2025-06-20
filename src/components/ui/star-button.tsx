"use client"

import { useEffect, useState } from "react"
import { UpdateUserProfile } from "@/server-actions/users"
import { StarIcon } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"

import { SetCurrentUser, UserState } from "@/lib/redux/userSlice"

export function StarButton({ gameId, gameName, gameCover }: { gameId: string; gameName: string; gameCover?: any }) {
  const dispatch = useDispatch()
  const { currentUserData }: UserState = useSelector((state: any) => state.user)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    if (currentUserData?.games?.some((g) => g.id === gameId)) {
      setLiked(true)
    }
  }, [currentUserData, gameId])

  const handleClick = async () => {
    const coverImage = gameCover
    const updatedGames = liked
      ? currentUserData?.games?.filter((g) => g.id !== gameId)
      : [...(currentUserData?.games || []), { id: gameId, name: gameName, cover: coverImage }]

    setLiked(!liked)

    try {
      const response = await UpdateUserProfile(currentUserData.id, { games: updatedGames })
      if (response.error) throw new Error(response.error)

      dispatch(SetCurrentUser({ ...currentUserData, ...response }))
    } catch (error) {
      console.error("Error updating user profile:", error)
    }
  }

  return (
    <StarIcon
      className={`top-0 right-0 h-5 w-5 cursor-pointer transition-colors ${
        liked ? "text-yellow-500" : "text-gray-600 hover:text-yellow-500"
      }`}
      onClick={handleClick}
    />
  )
}
