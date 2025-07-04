"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { GetCurrentUserFromMongoDB } from "@/server-actions/users"
import { UserType } from "@/types"
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs"
import { Home, Icon, MessagesSquare, Search, User } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"

import { SetCurrentUser, UserState } from "@/lib/redux/userSlice"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import CurrentUserInfo from "@/components/usable/user/current-user-infor"

import { HeaderSearch } from "./header-search"
/**
 * Mobile navigation component for bottom navigation bar
 * Provides responsive navigation for mobile devices with authentication integration
 * Features home, chat, search, and profile navigation with real-time user management
 * Hidden on public authentication routes
 *
 * @returns JSX element containing the mobile bottom navigation or null for public routes
 */
export const MobileNavigation = () => {
  const pathname = usePathname()
  const isPublicRoute = pathname.includes("sign-in") || pathname.includes("sign-up")
  if (isPublicRoute) return null

  const dispatch = useDispatch()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  useEffect(() => {
    if (isPublicRoute) return
    const getCurrentUser = async () => {
      try {
        const response = await GetCurrentUserFromMongoDB()
        if (response.error) throw new Error(response.error)
        dispatch(SetCurrentUser(response as UserType))
      } catch (error: any) {
        console.error(error.message)
      }
    }
    getCurrentUser()
  }, [])

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      name: "Chat",
      href: "/chat",
      icon: MessagesSquare,
      isActive: pathname === "/chat",
    },
    {
      name: "Search",
      href: "#",
      icon: Search,
      isActive: false,
      onClick: () => setIsSearchOpen(true),
    },
    {
      name: "Profile",
      href: "#",
      icon: User,
      isActive: false,
      onClick: () => setIsProfileOpen(true),
    },
  ]

  return (
    <>
      {/* Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="fixed top-20 border-none bg-transparent p-0 [&>button]:hidden">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <HeaderSearch />
        </DialogContent>
      </Dialog>

      <CurrentUserInfo setShowCurrentUserInfo={setIsProfileOpen} showCurrentUserInfo={isProfileOpen} />

      {/* Mobile Bottom Navigation */}
      <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-border/40 fixed right-0 bottom-0 left-0 z-[9999] h-16 border-t px-2 py-2 backdrop-blur lg:hidden">
        <div className="flex h-full items-center justify-around">
          <SignedOut>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex gap-10">
                <SignInButton mode="modal">
                  <Button variant="secondary" className="bg-gray-700 px-6 py-2 text-white hover:bg-gray-600">
                    Sign In
                  </Button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <Button variant="secondary" className="bg-gray-700 px-6 py-2 text-white hover:bg-gray-600">
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            </div>
          </SignedOut>
          <SignedIn>
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = item.isActive

              if (item.onClick) {
                return (
                  <Button
                    key={item.name}
                    variant="ghost"
                    size="sm"
                    onClick={item.onClick}
                    className={`relative flex h-12 w-16 flex-col items-center justify-center rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? "scale-110" : ""} transition-transform`} />
                    <span className="mt-1 text-xs font-medium">{item.name}</span>
                  </Button>
                )
              }

              return (
                <Link href={item.href} key={item.name}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`relative flex h-12 w-16 flex-col items-center justify-center rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? "scale-110" : ""} transition-transform`} />
                    <span className="mt-1 text-xs font-medium">{item.name}</span>
                  </Button>
                </Link>
              )
            })}
          </SignedIn>
        </div>
      </div>
    </>
  )
}
