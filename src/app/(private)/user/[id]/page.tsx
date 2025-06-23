import { Gamepad2, Globe, Languages, MapPin } from "lucide-react"

import { fetchUserInfo } from "@/lib/fetch/games"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ExpandableBio } from "@/components/usable/user/expandable-bio"
import { UserProfileGames } from "@/components/usable/user/user-profile-games"

export default async function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { userName, location, language, games, platforms, bio, profilePicture, name } = await fetchUserInfo(id)

  return (
    <div className="container mx-auto mb-36 min-h-screen">
      <div className="space-y-6 p-6">
        <Card className="gap-3 py-3">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <Avatar className="ring-border size-32 shadow-lg ring-2">
                <AvatarImage src={profilePicture || "/placeholder.svg"} alt={name} className="object-cover" />
                <AvatarFallback className="bg-gray-200 text-2xl font-bold">
                  {name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center sm:text-left">
                <h1 className="mb-1 text-3xl font-bold text-gray-900">{name}</h1>
                <p className="mb-4 text-lg text-gray-600">@{userName}</p>

                <Button
                  // onClick={() => onAddToChat(id!)}
                  className="rounded-full px-8 py-2 font-medium text-white transition-colors disabled:opacity-50"
                >
                  Start to Chat
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Bio Section */}
        {bio && (
          <Card className="gap-3 py-3">
            <CardHeader>
              <CardTitle className="text-xl">About</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="p-6">
              <ExpandableBio bio={bio} maxLength={200} className="leading-relaxed text-gray-700" />
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
                    <p className="text-sm text-gray-700">{location}</p>
                  </div>
                </div>
              )}

              {language && (
                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                  <Languages className="h-5 w-5 text-gray-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Language</h3>
                    <p className="text-sm text-gray-700">{language}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Platforms */}
        {platforms && platforms.length > 0 && (
          <Card className="gap-3 py-3">
            <CardHeader>
              <CardTitle className="text-xl">Platforms</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {platforms.map((platform: string) => (
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
        {games && games.length > 1 && <UserProfileGames games={games} />}
      </div>
    </div>
  )
}
