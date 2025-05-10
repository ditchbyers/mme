"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { NavItem } from "@/types"

import { Input } from "../ui/input"

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
    <div className="sticky top-0 w-full mx-auto h-20 bg-[#f4f4f4] z-50 shadow-sm">
      <nav className="relative container mx-auto grid grid-cols-3 h-full justify-center items-center md:px-5 xl:px-5">
        <div className="font-bold text-4xl">
          <Link href="/">MME</Link>
        </div>
        <div className="text-center">
          <Input
            type="text"
            onChange={handleChange}
            placeholder="Search games..."
            className="px-3 py-1 rounded-md border"
          />
        </div>
        <div className="hidden lg:flex space-x-6 text-xl overflow-hidden justify-center">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="uppercase hover:text-[#490007] font-bold"
              prefetch={false}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
