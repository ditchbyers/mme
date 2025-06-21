import { fetchUserInfo } from "@/lib/fetch/games"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default async function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { userName, location, language, games, platforms, bio, profilePicture } = await fetchUserInfo(id)

  return (
    <div className="mx-auto mb-36 max-w-[96rem] space-y-5 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="uppercase">{userName}</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="grid grid-cols-[auto_1fr] gap-10">
          <Avatar className="size-48">
            <AvatarImage src={profilePicture || "/placeholder.svg"} alt={userName} />
            <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="space-y-4"></div>
        </CardContent>
      </Card>
    </div>
  )
}
