"use client"

import * as React from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SearchCommandPopover() {
  const [searchValue, setSearchValue] = React.useState("")
  const [open, setOpen] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Update the open state based on search value
  React.useEffect(() => {
    setOpen(searchValue.length > 0)
  }, [searchValue])

  // Handle clicks outside to close popover
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  const searchResults = [
    {
      id: 1,
      title: "React Documentation",
      description: "Official React documentation and guides",
      url: "https://react.dev",
    },
    {
      id: 2,
      title: "React Hooks Tutorial",
      description: "Learn how to use React hooks effectively",
      url: "/tutorials/hooks",
    },
    {
      id: 3,
      title: "React State Management",
      description: "Best practices for managing state in React",
      url: "/guides/state",
    },
    {
      id: 4,
      title: "React Testing Library",
      description: "Testing React components made simple",
      url: "/testing/react",
    },
    {
      id: 5,
      title: "React Performance Tips",
      description: "Optimize your React applications",
      url: "/performance/react",
    },
    { id: 6, title: "React Router Guide", description: "Navigation in React applications", url: "/routing/react" },
    { id: 7, title: "React Context API", description: "Share data across components", url: "/context/react" },
    {
      id: 8,
      title: "React Custom Hooks",
      description: "Create reusable logic with custom hooks",
      url: "/hooks/custom",
    },
  ]

  const filteredResults = searchResults.filter(
    (result) =>
      result.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      result.description.toLowerCase().includes(searchValue.toLowerCase())
  )

  const handleSearch = (query: string) => {
    setSearchValue(query)
    setOpen(false)
    // Handle search logic here
    console.log("Searching for:", query)
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="relative" ref={containerRef}>
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            ref={inputRef}
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="bg-secondary h-12 py-3 pr-4 pl-10 text-base"
          />
        </div>

        {open && (
          <div className="absolute top-full right-0 left-0 z-50 mt-1">
            <div className="bg-popover text-popover-foreground rounded-md border p-0 shadow-md outline-none">
              <div className="max-h-80 overflow-y-auto">
                {filteredResults.length > 0 ? (
                  <div className="p-2">
                    <div className="text-muted-foreground px-2 py-1.5 text-sm font-medium">
                      Search Results ({filteredResults.length})
                    </div>
                    {filteredResults.map((result) => (
                      <Button
                        key={result.id}
                        variant="ghost"
                        className="hover:bg-muted h-auto w-full justify-start p-3 text-left font-normal"
                        onClick={() => handleSearch(result.title)}
                      >
                        <div className="flex w-full flex-col items-start">
                          <span className="font-medium">{result.title}</span>
                          <span className="text-muted-foreground mt-1 text-sm">{result.description}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground p-4 text-center">
                    <Search className="mx-auto mb-2 h-8 w-8" />
                    <p>No results found</p>
                    <p className="text-sm">Try a different search term</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
