import React from "react"

export default function Loader() {
  return (
    <div className="flex h-[calc(100vh-208px)] max-h-[calc(100vh-208px)] items-center justify-center">
      <div className="border-primary h-14 w-14 animate-spin rounded-full border-8 border-solid border-t-transparent"></div>
    </div>
  )
}
