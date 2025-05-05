import ClientGamePage from '@/components/usable/game-carousels'
import { cache } from 'react'

const fetchToken = cache(async () => {
  const res = await fetch('http:localhost:3000/api/twitch/token', { method: 'POST' })
  const json = await res.json()
  return json.access_token as string
})

export default async function Home() {
  const token = await fetchToken()
  const helix = await fetch(`http:localhost:3000/api/twitch/user?token=${token}`)
  const userData = await helix.json()

  console.log(userData)

  return (
    <div className="container mx-auto">
      <ClientGamePage data={userData.data} />
    </div>
  )
}
