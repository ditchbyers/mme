import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Custom React hook to detect if the current viewport is mobile-sized
 * Uses a responsive breakpoint to determine mobile vs desktop layout
 * Includes proper cleanup and event listener management
 *
 * @returns Boolean indicating if the current viewport is mobile (< 768px width)
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
