"use server"
import { currentUser, auth } from "@clerk/nextjs/server";

/**
 * Sends a new message to a chat
 * @param payload - The message data containing text, image, chat ID, sender, etc.
 * @param payload.text - Optional text content of the message
 * @param payload.image - Optional base64 encoded image data
 * @param payload.chat - The ID of the chat to send the message to
 * @param payload.sender - The ID of the user sending the message
 * @param payload.socketMessageId - Optional socket message ID for real-time updates
 * @returns Promise with the sent message data or error object
 */
export const SendNewMessage = async (payload: {
    text?: string,
    image?: string,
    chat: string,
    sender: string,
    socketMessageId?: string,
}) => {
    try {
        console.log("Sending message payload:", payload);
        const response = await fetch(`${process.env.DEV_URL}/message/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Error sending message:", data);
            return { error: data.error || "Unknown error occurred" };
        }

        return data;

    } catch (error: any) {
        return { error: error.message }

    }
}

/**
 * Retrieves all messages for a specific chat
 * @param chatId - The unique ID of the chat
 * @param userId - The ID of the user requesting the messages
 * @returns Promise with the chat messages data or error object
 */
export const GetChatMessages = async (chatId: string, userId: string) => {
    try {
        const user_id = userId
        const response = await fetch(`${process.env.DEV_URL}/message/chat/${chatId}?user_id=${user_id}`, {
            method: "GET"
        });

        const data = await response.json();
        if (!response.ok) {
            console.error("Error fetching messages:", data);
            return { error: data.error || "Unknown error occurred" };
        }

        return data;

    } catch (error: any) {
        return { error: error.message }
    }
}

/**
 * Marks all messages in a chat as read for a specific user
 * @param chatId - The ID of the chat where messages should be marked as read
 * @param userId - The ID of the user marking the messages as read
 * @returns Promise with operation result or error object
 */
export const ReadAllMessages = async ({ chatId, userId }: { chatId: string, userId: string }) => {
    try {
        const user_id = userId
        const response = await fetch(`${process.env.DEV_URL}/message/chat/${chatId}/?user_id=${user_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ chatId, userId })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Error marking messages as read:", data.error);
            return { error: data.error || "Unknown error occurred" };
        }

        return data;

    } catch (error: any) {
        return { error: error.message }

    }
}