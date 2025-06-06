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
        /*const newMessage = new MessageModel(payload)
        await newMessage.save()

        const existingChat = await ChatModel.findById(payload.chat)
        const existingUnreadCounts = existingChat?.unreadCounts

        //Todo: Das ist die Funktion welche die Unread Counts aktualisiert
        //aber ich bekomme jetzt ja nur zurück ob die Daten gespeichert wurden aber nicht von welchem User diese gelesen wurden


        existingChat?.users.forEach((user: any) => {
            const userIdString = user.toString()
            if (userIdString !== payload.sender) {
                existingUnreadCounts[userIdString] = (existingUnreadCounts[userIdString] || 0) + 1
            }
        })


        await ChatModel.findByIdAndUpdate(payload.chat, {
            lastMessage: newMessage._id,
            unreadCounts: existingUnreadCounts,
            lastMessageAt: new Date().toISOString(),
        })
        return { message: "Message sent successfully" }
        */
        console.log("Sending message payload:", payload);
        const response = await fetch(`${process.env.DEV_URL}/message`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Error sending message:", data.error);
            return { error: data.error || "Unknown error occurred" };
        }

        return data;

    } catch (error: any) {
        return { error: error.message }

    }
}

export const GetChatMessages = async (chatId: string, userId: string) => {
    try {
        /*const messages = await MessageModel.find({ chat: chatId })
            .populate("sender")
            .sort({ createdAt: -1 })
        console.log("Fetched messages:", messages)
        return JSON.parse(JSON.stringify(messages))
        */
        const user_id = userId
        const response = await fetch(`${process.env.DEV_URL}/message/chat/${chatId}/?user_id=${user_id}`, {
            method: "GET"
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Error fetching messages:", data.error);
            return { error: data.error || "Unknown error occurred" };
        }

        return data;

    } catch (error: any) {
        return { error: error.message }
    }
}

export const ReadAllMessages = async ({ chatId, userId }: { chatId: string, userId: string }) => {
    try {
        /*await MessageModel.updateMany(
            { chat: chatId, sender: { $ne: userId }, readBy: { $nin: [userId] } },
            { $addToSet: { readBy: userId } }
        )
        const existingChat = await ChatModel.findById(chatId)
        const existingUnreadCounts = existingChat?.unreadCounts
        const newUnreadCounts = { ...existingUnreadCounts, [userId]: 0 }

        await ChatModel.findByIdAndUpdate(chatId, {
            unreadCounts: newUnreadCounts,
        })
        return { message: "All messages marked as read" }
        */
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