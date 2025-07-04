import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

/**
 * Route matcher for public routes that don't require authentication
 * Defines which routes are accessible without user login
 */
const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)", "/api/twitch/(.*)", "/contactus(.*)" , "/api/webhooks/(.*)", ])

/**
 * Next.js middleware for authentication using Clerk
 * Protects private routes while allowing public access to specified routes
 * Automatically redirects unauthenticated users to sign-in page
 */
export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

/**
 * Next.js middleware configuration
 * Defines which routes the middleware should run on
 * Excludes static files and Next.js internals for performance
 */
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
