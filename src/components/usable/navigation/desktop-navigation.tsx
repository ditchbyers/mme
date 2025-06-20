"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { NavItem } from "@/types"
import { UserButton } from "@clerk/nextjs"

import { Input } from "../../ui/input"

interface NavigationProps {
  items: NavItem[]
}

export function DesktopNavigation({ items }: NavigationProps) {
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const params = new URLSearchParams()
    if (value) {
      params.set("query", value)
    }
    router.replace(`/?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="sticky top-0 z-50 mx-auto h-20 w-full bg-[#f4f4f4] shadow-sm">
      <nav className="relative container mx-auto grid h-full grid-cols-3 items-center justify-center px-5">
        <div className="text-4xl font-bold">
          <Link href="/">MME</Link>
        </div>
        <div className="text-center">
          <Input
            type="text"
            onChange={handleChange}
            placeholder="Search games..."
            className="rounded-md border px-3 py-1"
          />
        </div>
        <div className="flex justify-end space-x-6 overflow-hidden text-xl">
          <UserButton
            userProfileMode="navigation"
            userProfileUrl="/user-profile"
            appearance={{
              elements: { userButtonPopoverCard: { pointerEvents: "initial" } },
            }}
          />
        </div>
      </nav>
    </div>
  )
}
