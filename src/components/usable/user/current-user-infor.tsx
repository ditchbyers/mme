import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import convertFileToBase64 from "@/helpers/convertFileToBase64"
import { UpdateUserProfile } from "@/server-actions/users"
import { useClerk } from "@clerk/nextjs"
import { Divider, Drawer, Select, Upload } from "antd"
import { Pencil } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"

import socket from "@/config/socket-config"
import { SetCurrentUser, UserState } from "@/lib/redux/userSlice"
import { Button } from "@/components/ui/button"

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

  const isEditableText = (key: string) => ["Name", "Username", "Bio"].includes(key)
  const isDropdown = (key: string) => ["Location", "Language", "Platforms"].includes(key)

  const getPropertyKey = (label: string): keyof typeof editableFields => {
    const map: any = {
      Name: "name",
      Username: "userName",
      Bio: "bio",
      Location: "location",
      Language: "language",
      Platforms: "platforms",
    }
    return map[label]
  }

  const getProperty = (label: string, value: string | string[]) => {
    const fieldKey = getPropertyKey(label)

    const renderValue = () => {
      if (editingField === label) {
        if (label === "Bio") {
          return (
            <textarea
              value={editableFields[fieldKey] as string}
              onChange={(e) => setEditableFields({ ...editableFields, [fieldKey]: e.target.value })}
              rows={4}
              className="w-full resize-none rounded border p-1"
            />
          )
        }

        if (isEditableText(label)) {
          return (
            <input
              type="text"
              value={editableFields[fieldKey] as string}
              onChange={(e) => setEditableFields({ ...editableFields, [fieldKey]: e.target.value })}
              className="w-full rounded border p-1"
            />
          )
        } else if (isDropdown(label)) {
          const options = {
            Location: ["Africa", "Europe", "Asia", "North America", "South America"],
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

          if (label === "Platforms") {
            const platformOptions = options.Platforms
            return (
              <Select
                mode="multiple"
                value={editableFields[fieldKey]}
                onChange={(values) => setEditableFields({ ...editableFields, [fieldKey]: values })}
                style={{ width: "100%" }}
                options={platformOptions.map((platform) => ({
                  label: platform,
                  value: platform,
                }))}
                placeholder="Select platforms"
              />
            )
          } else {
            return (
              <Select
                value={editableFields[fieldKey]}
                onChange={(value) => setEditableFields({ ...editableFields, [fieldKey]: value })}
                style={{ width: "100%" }}
                options={options[label as keyof typeof options].map((opt) => ({
                  label: opt,
                  value: opt,
                }))}
                placeholder={`Select ${label.toLowerCase()}`}
              />
            )
          }
        }
      }

      return <span className="text-gray-600">{Array.isArray(value) ? value.join(", ") : value}</span>
    }

    return (
      <div className="flex flex-col">
        <div className="group flex items-center gap-2">
          <span className="cursor-pointer font-semibold text-gray-700">{label}</span>
          {(isEditableText(label) || isDropdown(label)) && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded border border-white bg-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:border-gray-700 hover:bg-transparent"
              onClick={() => setEditingField(editingField === label ? null : label)}
            >
              <Pencil className="h-4 w-4 text-gray-500 hover:text-black" />
            </Button>
          )}
        </div>
        {renderValue()}
      </div>
    )
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

  return (
    <Drawer open={showCurrentUserInfo} onClose={() => setShowCurrentUserInfo(false)} title="Profile">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col items-center justify-center gap-5">
          {!selectedFile && (
            <img src={currentUserData?.profilePicture} alt="Profile Picture" className="h-28 w-28 rounded-full" />
          )}
          <Upload
            beforeUpload={(file) => {
              setSelectedFile(file)
              return false
            }}
            className="cursor-pointer"
            listType={selectedFile ? "picture-circle" : "text"}
            maxCount={1}
          >
            Change Profile Picture
          </Upload>
        </div>

        <Divider className="my-1 border-gray-200" />

        <div className="flex flex-col gap-5">
          {getProperty("Name", editableFields.name)}
          {getProperty("Username", editableFields.userName)}
          {getProperty("Email", currentUserData?.email)}
          {getProperty("Bio", editableFields.bio)}
          {getProperty("Location", editableFields.location)}
          {getProperty("Language", editableFields.language)}
          {getProperty("Games", currentUserData?.games?.map((game) => game.name).join(", ") || "")}
          {getProperty("Platforms", editableFields.platforms)}
        </div>

        <div className="flex flex-col gap-5">
          <Button className="w-full" onClick={onUpdateProfile} disabled={!isChanged}>
            Update Profile
          </Button>

          <Button className="w-full" disabled={loading} onClick={onLogout}>
            {loading ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </Drawer>
  )
}

export default CurrentUserInfo
