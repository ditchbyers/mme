import { cache } from "react"
import { GameDetails, Stream, UserType } from "@/types"

export const fetchStreams = cache(async (): Promise<Stream[]> => {
  const res = await fetch("https://revenant.lyrica.systems/discovery/stream", {
    method: "GET",
    headers: {
      "X-Session-Token": "_dev_skip_auth_roy",
    },
  })
  return await res.json()
})

export const fetchGameDetails = async (id: string): Promise<GameDetails> => {
  const res = await fetch(`https://revenant.lyrica.systems/discovery/game/${id}`, {
    method: "GET",
    headers: {
      "X-Session-Token": "_dev_skip_auth_roy",
    },
  })

  return res.json()
}

export const fetchUserInfo = async (id: string): Promise<UserType> => {
  const res = await fetch(`https://revenant.lyrica.systems/user/self/profile?clerk_user_id=${id}`, { method: "GET" })

  return res.json()
}
