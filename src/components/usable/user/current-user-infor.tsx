"use client"

import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import convertFileToBase64 from "@/helpers/convertFileToBase64"
import { UpdateUserProfile } from "@/server-actions/users"
import { useClerk } from "@clerk/nextjs"
import { Select as MultiSelect, Upload } from "antd"
import { format } from "date-fns"
import { Camera, Gamepad2, Globe, Languages, MapPin, Monitor, Pencil, Search, User, X } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"

import socket from "@/config/socket-config"
import { SetCurrentUser, UserState } from "@/lib/redux/userSlice"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"

/**
 * Current user information component for displaying and editing user profile
 * Provides comprehensive user profile management with real-time updates
 * Includes profile picture upload, field editing, logout functionality
 *
 * @param showCurrentUserInfo - Boolean state controlling the visibility of the user info sheet
 * @param setShowCurrentUserInfo - State setter function to control sheet visibility
 * @returns JSX element containing the user profile sheet or null if no user data
 */
function CurrentUserInfo({
  showCurrentUserInfo,
  setShowCurrentUserInfo,
}: {
  showCurrentUserInfo: boolean
  setShowCurrentUserInfo: Dispatch<SetStateAction<boolean>>
}) {
  const [loading, setLoading] = useState(false)
  const { currentUserData }: UserState = useSelector((state: any) => state.user)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { signOut } = useClerk()
  const router = useRouter()
  const dispatch = useDispatch()
  const [editableFields, setEditableFields] = useState({
    name: currentUserData?.name || "",
    userName: currentUserData?.userName || "",
    bio: currentUserData?.bio || "",
    location: currentUserData?.location || "",
    language: currentUserData?.language || "",
    platforms: currentUserData?.platforms || [],
  })
  const [editingField, setEditingField] = useState<string | null>(null)
  const [gameSearchQuery, setGameSearchQuery] = useState("")

  const isChanged =
    selectedFile !== null ||
    JSON.stringify(editableFields) !==
      JSON.stringify({
        name: currentUserData?.name || "",
        userName: currentUserData?.userName || "",
        bio: currentUserData?.bio || "",
        location: currentUserData?.location || "",
        language: currentUserData?.language || "",
        platforms: currentUserData?.platforms || [],
      })

  const optionSettings = {
    "Server Location": ["Africa", "Europe", "Asia", "North America", "South America"],
    Language: [
      "German",
      "English",
      "French",
      "Spanish",
      "Italian",
      "Chinese",
      "Japanese",
      "Korean",
      "Russian",
      "Portuguese",
      "Arabic",
      "Schwäbisch",
    ],
    Platforms: ["PC", "PlayStation", "Xbox", "Switch", "Stick and Stone"],
  }

  const onLogout = async () => {
    try {
      setLoading(true)
      socket.emit("logout", currentUserData?.id)
      await signOut()
      setShowCurrentUserInfo(false)
      setTimeout(() => {
        router.push("/")
      }, 1500)
    } catch (error: any) {
      console.error("Error signing out: ", error)
    } finally {
      setLoading(false)
    }
  }

  const onUpdateProfile = async () => {
    try {
      setLoading(true)
      let profilePictureBase64 = currentUserData?.profilePicture

      if (selectedFile) {
        profilePictureBase64 = await convertFileToBase64(selectedFile)
      }

      const payload = {
        ...editableFields,
        profilePicture: profilePictureBase64,
      }

      const response = await UpdateUserProfile(currentUserData?.id!, payload)
      if (response.error) throw new Error(response.error)

      dispatch(SetCurrentUser({ ...currentUserData, ...response }))
      toast("Profile has been updated", {
        description: format(new Date(), "EEEE, MMMM dd, yyyy 'at' h:mm a"),
      })
    } catch (error: any) {
      console.error("Error saving :  ", error)
    } finally {
      setLoading(false)
      setSelectedFile(null)
      setEditingField(null)
    }
  }

  useEffect(() => {
    if (showCurrentUserInfo && currentUserData) {
      setEditableFields({
        name: currentUserData.name || "",
        userName: currentUserData.userName || "",
        bio: currentUserData.bio || "",
        location: currentUserData.location || "",
        language: currentUserData.language || "",
        platforms: currentUserData.platforms || [],
      })
    }
  }, [showCurrentUserInfo, currentUserData])

  if (!currentUserData) {
    return null
  }

  return (
    <Sheet open={showCurrentUserInfo} onOpenChange={() => setShowCurrentUserInfo(false)}>
      <SheetContent side="right" className={cn("pointer flex w-[85%] flex-col rounded-l-2xl sm:w-3/4")}>
        <SheetHeader className="left-left pb-6">
          <SheetTitle className="text-xl font-bold">Profile Settings</SheetTitle>
        </SheetHeader>
        <div className="flex-1 space-y-6 overflow-y-auto px-4 pb-20">
          <div className="flex items-center space-x-4">
            <div className="relative cursor-pointer">
              <Upload
                beforeUpload={(file) => {
                  setSelectedFile(file)
                  return false
                }}
                className="cursor-pointer"
                listType={selectedFile ? "picture-circle" : "text"}
                maxCount={1}
              >
                <Avatar className="ring-background h-20 w-20 shadow-lg ring-4">
                  <AvatarImage
                    src={currentUserData?.profilePicture || "/placeholder.svg"}
                    alt={currentUserData?.name}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-xl font-bold text-white">
                    {currentUserData?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -right-1 -bottom-1 h-8 w-8 cursor-pointer rounded-full p-0 shadow-lg"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </Upload>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{currentUserData?.name}</h3>
              <p className="text-muted-foreground text-sm">{currentUserData?.email}</p>
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Full Name</span>
              </Label>
              <Input
                id="name"
                value={editableFields["name"]}
                onChange={(e) => setEditableFields({ ...editableFields, ["name"]: e.target.value })}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Server Location</span>
              </Label>
              <Select
                value={editableFields["location"]}
                onValueChange={(value) => setEditableFields({ ...editableFields, ["location"]: value })}
              >
                <SelectTrigger className="h-12 w-full">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {optionSettings["Server Location"].map((opt, index) => (
                    <SelectItem key={index} value={opt} className="hover:bg-accent cursor-pointer">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center space-x-2">
                <Languages className="h-4 w-4" />
                <span>Language</span>
              </Label>
              <Select
                value={editableFields["language"]}
                onValueChange={(value) => setEditableFields({ ...editableFields, ["language"]: value })}
              >
                <SelectTrigger className="h-12 w-full">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {optionSettings["Language"].map((opt) => (
                    <SelectItem value={opt} className="hover:bg-accent cursor-pointer">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="platforms" className="flex items-center space-x-2">
                <Monitor className="h-4 w-4" />
                <span>Platforms</span>
              </Label>
              <MultiSelect
                mode="multiple"
                value={editableFields["platforms"]}
                onChange={(values) => setEditableFields({ ...editableFields, ["platforms"]: values })}
                style={{ width: "100%" }}
                options={optionSettings["Platforms"].map((platform) => ({
                  label: platform,
                  value: platform,
                }))}
                placeholder="Select platforms"
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={editableFields["bio"]}
                onChange={(e) => setEditableFields({ ...editableFields, ["bio"]: e.target.value })}
                className="border-input bg-background focus:ring-ring w-full rounded-md border p-3 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
                placeholder="Tell us about yourself..."
              />
            </div>
            {currentUserData.games && currentUserData.games.length > 0 && (
              <div className="space-y-4 pb-6">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center space-x-2">
                    <Gamepad2 className="h-4 w-4" />
                    <span>
                      Favorite Games (
                      {currentUserData.games?.filter((game) =>
                        game.name.toLowerCase().includes(gameSearchQuery.toLowerCase())
                      ).length || 0}
                      )
                    </span>
                  </Label>
                </div>
                <div className="space-y-3">
                  {/* Search Bar for Games */}
                  <div className="relative">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                      type="search"
                      placeholder="Search your games..."
                      value={gameSearchQuery}
                      onChange={(e) => setGameSearchQuery(e.target.value)}
                      className="bg-muted/50 border-border/50 focus-visible:ring-primary/20 h-10 pr-4 pl-10 focus-visible:ring-2"
                    />
                  </div>

                  {/* Games List - Scrollable with Max Height */}
                  <div className="bg-muted/20 h-64 max-h-64 space-y-2 overflow-y-auto rounded-lg border p-3 pr-2">
                    {currentUserData.games
                      .filter((game) => game.name.toLowerCase().includes(gameSearchQuery.toLowerCase()))
                      .map((game, index) => (
                        <div
                          key={game.id}
                          className="group bg-background hover:bg-accent/50 border-border/50 relative rounded-lg border p-3 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="bg-muted relative aspect-[3/4] w-14 flex-shrink-0 overflow-hidden rounded-md">
                              <Image
                                src={
                                  game.cover.replace("{width}", "112").replace("{height}", "150") || "/placeholder.svg"
                                }
                                alt={`${game.name} cover`}
                                className="object-cover transition-transform duration-200 group-hover:scale-105"
                                fill
                                sizes="56px"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = "/placeholder.svg?height=56&width=56"
                                }}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-foreground text-sm font-medium">{game.name}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0 transition-colors"
                              onClick={() => {
                                const updatedGames = currentUserData.games!.filter((g) => g.id !== game.id)
                              }}
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Remove {game.name}</span>
                            </Button>
                          </div>
                        </div>
                      ))}

                    {/* No Results Message */}
                    {gameSearchQuery &&
                      currentUserData.games.filter((game) =>
                        game.name.toLowerCase().includes(gameSearchQuery.toLowerCase())
                      ).length === 0 && (
                        <div className="text-muted-foreground py-8 text-center">
                          <Search className="mx-auto mb-2 h-6 w-6 opacity-50" />
                          <p className="text-sm">No games found for "{gameSearchQuery}"</p>
                          <p className="text-xs">Try a different search term</p>
                        </div>
                      )}
                  </div>

                  {/* Games Summary */}
                  <div className="text-muted-foreground bg-muted/30 flex items-center justify-between rounded-lg p-3 text-xs">
                    <span>
                      {gameSearchQuery
                        ? `Showing ${
                            currentUserData.games.filter((game) =>
                              game.name.toLowerCase().includes(gameSearchQuery.toLowerCase())
                            ).length
                          } of ${currentUserData.games.length} games`
                        : `Total games: ${currentUserData.games.length}`}
                    </span>
                    <span>Scroll to see all games</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button className="w-full" onClick={onUpdateProfile} disabled={!isChanged}>
              Update Profile
            </Button>

            <Button className="w-full" disabled={loading} onClick={onLogout}>
              {loading ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default CurrentUserInfo
