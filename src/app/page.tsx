import ClientGamePage from '@/components/usable/game-carousels'
import { UserButton} from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
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

  const loggedInUserData = await currentUser()
  console.log(loggedInUserData)
  //console.log(userData)

  let email = ""
  if (loggedInUserData?.emailAddresses && loggedInUserData?.emailAddresses.length > 0) {
    email = loggedInUserData?.emailAddresses[0].emailAddress
  }

  return (
    <div className="container mx-auto">
      <ClientGamePage data={userData.data} />
      <div className="flex flex-col gap-3">
        <UserButton/>
        <span> First Name : {loggedInUserData?.firstName}</span>
        <span> Last Name : {loggedInUserData?.lastName}</span>
        <span> User Name : {loggedInUserData?.username}</span>
        <span> Email : {email}</span>
      </div>
    </div>
  )
}
