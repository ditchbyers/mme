import ClientGamePage from '@/components/usable/game-carousels'
import NavigateButton from '@/components/ui/navigate-button'
import { cache } from 'react'


const fetchToken = cache(async () => {
  const res = await fetch('http://localhost:3000/api/twitch/token', { method: 'POST' })
  const json = await res.json()
  return json.access_token as string
})



export default async function Home() {
  const token = await fetchToken()
  const helix = await fetch(`http:localhost:3000/api/twitch/user?token=${token}`)
  const userData = await helix.json()


  return (

    <div className="container mx-auto w-full h-full">
      <NavigateButton href="/chat">
        Chat
      </NavigateButton>
      <ClientGamePage data={userData.data} />
    </div>
  )
}
