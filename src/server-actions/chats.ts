"use server";
import ChatModel from "@/models/chat-model";


export const CreateNewChat = async (payload: any) => {
    try {
        /*await ChatModel.create(payload);
        const newchats = await ChatModel.find({
            users: {
                $in: [payload.createdBy],
            },
        }).populate("users").sort({ updatedAt: -1 });
        return JSON.parse(JSON.stringify(newchats));
        */
        const response = await fetch("/api/chats", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
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
        /*const users = await ChatModel.find({
            users: { $in: [userId] }
        }).populate("users").populate("lastMessage").populate("createdBy").populate({ path: "lastMessage", populate: { path: "sender", } }).sort({ lastMessageAt: -1 });
        return JSON.parse(JSON.stringify(users));
        */
        const response = await fetch(`/api/chats?userId=${userId}`, {
            method: "GET"
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Error fetching chats:", data.error);
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
        /*const chat = await ChatModel.findById(chatId)
            .populate("users")
            .populate("lastMessage")
            .populate("createdBy")
            .populate({ path: "lastMessage", populate: { path: "sender", } });
        return JSON.parse(JSON.stringify(chat));
        */

        const response = await fetch(`/api/chats/${chatId}`, {
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

export const UpdateChat = async ({ chatId, payload }: { chatId: string, payload: any }) => {
    try {
        /*await ChatModel.findByIdAndUpdate(chatId, payload)
        return { message: "Chat updated successfully" };
        */
       
        const response = await fetch(`/api/chats/${chatId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Error updating chat:", data.error);
            return { error: data.error || "Unknown error occurred" };
        }

        return data;

    } catch (error: any) {
        return {
            error: error.message
        }

    }
}