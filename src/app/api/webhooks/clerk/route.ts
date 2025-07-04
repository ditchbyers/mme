import { NextRequest } from "next/server"
import { verifyWebhook } from "@clerk/nextjs/webhooks"

/**
 * Webhook handler for Clerk authentication events
 * Processes session-related events (ended, removed, revoked) and cleans up user sessions
 *
 * @param req - The incoming webhook request from Clerk
 * @returns Promise resolving to a response indicating webhook processing status
 */
export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

    if (evt.type === "session.ended" || evt.type === "session.removed" || evt.type === "session.revoked") {
      const userId = evt.data.user_id
      const payload = { session_token: [evt.data.id] }

      try {
        const response = await fetch(`${process.env.DEV_URL}/user/self/session?clerk_user_id=${userId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error("Error deleting session:", response.status, errorText)
          return new Response(JSON.stringify({ error: errorText || "Unknown error occurred" }), {
            status: response.status,
            headers: { "Content-Type": "application/json" },
          })
        }
      } catch (innerErr) {
        console.error("Fetch to delete session failed:", innerErr)
        return new Response(JSON.stringify({ error: (innerErr as Error).message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        })
      }
    }

    return new Response("Webhook received", { status: 200 })
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return new Response("Error verifying webhook", { status: 400 })
  }
}
