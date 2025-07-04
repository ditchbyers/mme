"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"

interface ExpandableBioProps {
  bio: string
  maxLength?: number
  className?: string
}

/**
 * Expandable bio component for displaying user biography text
 * Automatically truncates long text and provides expand/collapse functionality
 * Includes smooth transitions and responsive design
 *
 * @param bio - The biography text to display
 * @param maxLength - Maximum number of characters to show before truncation (default: 150)
 * @param className - Optional CSS classes for styling the bio text
 * @returns JSX element containing the expandable bio with toggle button
 */
export function ExpandableBio({ bio, maxLength = 150, className = "" }: ExpandableBioProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // If bio is shorter than maxLength, don't show expand/collapse
  if (bio.length <= maxLength) {
    return <p className={className}>{bio}</p>
  }

  const truncatedBio = bio.slice(0, maxLength).trim()
  const displayBio = isExpanded ? bio : `${truncatedBio}...`

  return (
    <div>
      <p className={className}>{displayBio}</p>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 h-auto p-0 font-medium text-blue-600 hover:bg-transparent hover:text-blue-700"
      >
        {isExpanded ? "Show less" : "Show more"}
      </Button>
    </div>
  )
}
