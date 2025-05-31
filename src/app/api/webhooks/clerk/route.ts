import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

    // Do something with payload
    // For this guide, log payload to console

    // Todo : Replace with your own logic to handle the webhook event

    if (evt.type == "session.ended" || evt.type == "session.removed" || evt.type == "session.revoked") {
      const UserId = evt.data.user_id
      const payload = {
        session_token: [evt.data.id]
      };
      const response = await fetch(`${process.env.DEV_URL}/user/self/session?clerk_user_id=${UserId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Fehler beim Löschen der Session:", response.status, errorText);
        return { error: errorText || "Unknown error occurred" };
      }
    }


    const { id } = evt.data
    const eventType = evt.type
    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
    console.log('Webhook payload:', evt.data)

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}