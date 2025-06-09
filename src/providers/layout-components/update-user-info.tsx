"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { UserState, SetCurrentUser } from "@/redux/userSlice"
import convertFileToBase64 from "@/helpers/convertFileToBase64"
import { Button } from "@/components/ui/button"
import { Upload, Select, Divider } from "antd"
import { Pencil } from "lucide-react"
import socket from "@/config/socket-config"
import { UpdateUserProfile } from "@/server-actions/users"

export default function UpdateUserInfoModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { currentUserData }: UserState = useSelector((state: any) => state.user)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { signOut } = useClerk()
  const router = useRouter()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

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
    const key = getPropertyKey(label)
    const isEditing = editingField === label

    return (
      <div className="flex flex-col gap-1">
        <div className="group flex items-center justify-between">
          <span className="font-semibold">{label}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditingField(isEditing ? null : label)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
        </div>
        {isEditing ? (
          key === "platforms" ? (
            <Select
              mode="multiple"
              value={editableFields[key]}
              onChange={(vals) => setEditableFields({ ...editableFields, [key]: vals })}
              style={{ width: "100%" }}
              options={options.Platforms.map((p) => ({ label: p, value: p }))}
            />
          ) : key === "location" || key === "language" ? (
            <Select
              value={editableFields[key]}
              onChange={(val) => setEditableFields({ ...editableFields, [key]: val })}
              style={{ width: "100%" }}
              options={options[label as keyof typeof options].map((val) => ({
                label: val,
                value: val,
              }))}
            />
          ) : key === "bio" ? (
            <textarea
              value={editableFields[key]}
              onChange={(e) =>
                setEditableFields({ ...editableFields, [key]: e.target.value })
              }
              rows={3}
              className="border p-2 rounded w-full"
            />
          ) : (
            <input
              type="text"
              value={editableFields[key]}
              onChange={(e) =>
                setEditableFields({ ...editableFields, [key]: e.target.value })
              }
              className="border p-2 rounded w-full"
            />
          )
        ) : (
          <p className="text-muted-foreground text-sm">
            {Array.isArray(value) ? value.join(", ") : value}
          </p>
        )}
      </div>
    )
  }

  const onLogout = async () => {
    try {
      setLoading(true)
      socket.emit("logout", currentUserData?.id)
      await signOut()
      onOpenChange(false)
      router.push("/")
    } catch (err) {
      console.error("Logout error:", err)
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
      setEditingField(null)
      setSelectedFile(null)
    } catch (err) {
      console.error("Update error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open && currentUserData) {
      setEditableFields({
        name: currentUserData.name || "",
        userName: currentUserData.userName || "",
        bio: currentUserData.bio || "",
        location: currentUserData.location || "",
        language: currentUserData.language || "",
        platforms: currentUserData.platforms || [],
      })
    }
  }, [open, currentUserData])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profil bearbeiten</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 items-center mb-4">
          {!selectedFile && currentUserData?.profilePicture && (
            <img
              src={currentUserData.profilePicture}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover"
            />
          )}
          <Upload
            beforeUpload={(file) => {
              setSelectedFile(file)
              return false
            }}
            maxCount={1}
          >
            <Button variant="outline">Profilbild ändern</Button>
          </Upload>
        </div>

        <Divider className="my-1 border-gray-200" />

        <div className="flex flex-col gap-4">
          {getProperty("Name", editableFields.name)}
          {getProperty("Username", editableFields.userName)}
          {getProperty("Bio", editableFields.bio)}
          {getProperty("Location", editableFields.location)}
          {getProperty("Language", editableFields.language)}
          {getProperty("Platforms", editableFields.platforms)}
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <Button onClick={onUpdateProfile} disabled={!isChanged || loading}>
            {loading ? "Speichern..." : "Profil speichern"}
          </Button>
          <Button onClick={onLogout} variant="destructive" disabled={loading}>
            {loading ? "Abmelden..." : "Logout"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
