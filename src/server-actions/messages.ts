"use server"
import { currentUser, auth } from "@clerk/nextjs/server";

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