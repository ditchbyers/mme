"use client"

import { UserProfile } from "@clerk/nextjs"

import { ProfileSettings, UserDataProps } from "@/components/usable/profile-settings"

const DotIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
    </svg>
  )
}

const CustomPage = () => {
  return (
    <div>
      <h1>Custom page</h1>
      <p>This is the content of the custom page.</p>
    </div>
  )
}

const userDataStub = {
  name: "Max Mustermann",
  userName: "xXDestroyerXx",
  age: 69,
  bio: `Risiko ist besser als Reue  
Party Haus  
Seit 2000 am WoW Zocken  
Ez  
#Werbung  
`,
  region: "",
  platform: "",
  games: [
    { id: "1", name: "League of Legends" },
    { id: "2", name: "Fortnite" },
    { id: "3", name: "Roblox" },
    { id: "4", name: "Minecraft" },
  ],
  langugage: ["German", "English", "Spanish"],
}

const UserProfilePage = () => (
  <UserProfile
    appearance={{
      elements: {
        rootBox: "!w-full h-full",
        cardBox: "!w-full !max-w-full !shadow-none !h-[calc(100vh-160px)]",
        scrollBox: "rounded-none",
      },
    }}
  >
    <UserProfile.Page label="account" />
    <UserProfile.Page label="security" />
    <UserProfile.Page label="Custom Page" url="test" labelIcon={<DotIcon />}>
      <ProfileSettings userData={userDataStub} />
    </UserProfile.Page>
    <UserProfile.Page label="Custom Page2" url="test2" labelIcon={<DotIcon />}>
      <CustomPage />
    </UserProfile.Page>
  </UserProfile>
)

export default UserProfilePage
