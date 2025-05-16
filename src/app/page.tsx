import ClientGamePage from '@/components/usable/game-carousels'
import NavigateButton from '@/components/ui/navigate-button'
import { UserButton} from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import { connect } from 'http2'
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
    <div className="container mx-auto">
      <NavigateButton href="/groups/create-group">
        Gruppe erstellen
      </NavigateButton>
      <ClientGamePage data={userData.data} />
    </div>
  )
}
