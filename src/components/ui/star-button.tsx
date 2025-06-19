"use client"

import { useEffect, useState } from "react"
import { StarIcon } from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import { UserState, SetCurrentUser } from "@/redux/userSlice"
import { UpdateUserProfile } from "@/server-actions/users"



export function StarButton({ gameId, gameName, gameCover }: { gameId: string; gameName: string ; gameCover?: any }) {
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
      : [...(currentUserData?.games || []), { id: gameId, name: gameName , cover: coverImage }]

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
      className={`w-5 h-5 right-0 top-0 cursor-pointer transition-colors ${
        liked ? "text-yellow-500" : "text-gray-600 hover:text-yellow-500"
      }`}
      onClick={handleClick}
    />
  )
}
