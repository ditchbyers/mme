"use server";
import ChatModel from "@/models/chat-model";


export const CreateNewChat = async (payload: any) => {
    try {
        const newChat = await ChatModel.create(payload);
        return JSON.parse(JSON.stringify(newChat));
    } catch (error: any) {
        return {
            error: error.message
        }
    }

}

export const GetAllChats = async (userId: string) => {
    try {
        const users = await ChatModel.find({
            users: { $in: [userId] }
        })
        return JSON.parse(JSON.stringify(users));

    } catch (error: any) {
        return {
            error: error.message
        }

    }
}