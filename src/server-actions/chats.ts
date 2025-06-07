"use server";
import { auth } from "@clerk/nextjs/server";
import { current } from "@reduxjs/toolkit";



export const CreateNewChat = async (payload: any, currentUserId: any) => {
    try {

        console.log("payload", payload)
        const { sessionId } = await auth();
        const currentUser = currentUserId.userId

        const response = await fetch(`${process.env.DEV_URL}/chat/?user_id=${currentUser}&session_token=${sessionId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();

        if (!response.ok) {
            console.log("scheiße")
            console.error("Error creating chat:", data.error);
            return { error: data.error || "Unknown error occurred" };
        }
        return data;

    } catch (error: any) {
        return {
            error: error.message
        }
    }

}

export const GetAllChats = async (userId: string) => {
    try {

        console.log("userId", userId)
        const response = await fetch(`${process.env.DEV_URL}/chat/${userId}/all`, {
            method: "GET"
        });

        const data = await response.json();
        if (!response.ok) {
            console.error("Error fetching chats:", data);
            return { error: data.error || "Unknown error occurred" };
        }
        return data;

    } catch (error: any) {
        return {
            error: error.message
        }

    }
}

export const GetChatDataById = async (chatId: string) => {
    try {
        const response = await fetch(`${process.env.DEV_URL}/chat/${chatId}`, {
            method: "GET"
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Error fetching chat:", data.error);
            return { error: data.error || "Unknown error occurred" };
        }

        return data;

    } catch (error: any) {
        return {
            error: error.message
        }

    }
}

export const UpdateChat = async ({ chatId, payload, currentUserId }: { chatId: string, payload: any, currentUserId: any }) => {
    try {
        /*await ChatModel.findByIdAndUpdate(chatId, payload)
        return { message: "Chat updated successfully" };
        */
        const { sessionId } = await auth();
        const currentUser = currentUserId.userId
        console.log("Session ID:", sessionId);
        console.log("Current User ID:", currentUser);
        console.log("chatId:", chatId);
        const response = await fetch(`${process.env.DEV_URL}/chat/${chatId}?user_id=${currentUser}&session_token=${sessionId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Error updating chat:", data);
            return { error: data.error || "Unknown error occurred" };
        }

        return data;

    } catch (error: any) {
        return {
            error: error.message
        }

    }
}