import React from "react"

import { MarkdownRenderer } from "@/lib/markdown"

import { TH2 } from "../typography/h2"
import { TList } from "../typography/list"
import { TypographyP as P } from "../typography/p"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"

export interface GameProps {
  id: string
  name: string
}

export interface UserDataProps {
  userData: {
    name: string
    userName: string
    age: number
    bio: string
    region: string
    platform: string
    games: GameProps[]
    langugage: string[]
  }
}

export const ProfileSettings = ({ userData }: UserDataProps) => {
  return (
    <div className="space-y-10">
      <TH2>Profile Settings</TH2>
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input type="text" id="name" placeholder={userData.name} />
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input type="text" id="username" placeholder={userData.userName} />
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input type="number" id="age" placeholder={userData.age.toString()} />
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" placeholder={userData.bio} />
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="region">Region</Label>
          <Input type="text" id="region" placeholder={userData.region} />
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <Input type="text" id="platform" placeholder={userData.platform} />
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <Input type="text" id="platform" placeholder={userData.platform} />
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <Input type="text" id="platform" placeholder={userData.platform} />
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <Input type="text" id="platform" placeholder={userData.platform} />
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <Input type="text" id="platform" placeholder={userData.platform} />
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <Input type="text" id="platform" placeholder={userData.platform} />
        </div>
      </div>

      <P className="rounded border border-black px-4 py-2">Languages: {userData.langugage.join(", ")}</P>
      <P className="rounded border border-black px-4 py-2">Games:</P>
      <TList>
        {userData.games.map((game) => (
          <li key={game.id}>{game.name}</li>
        ))}
      </TList>
    </div>
  )
}
