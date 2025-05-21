"use server"
import MessageModel from "@/models/message-modle"
import ChatModel from "@/models/chat-model"

export const SendNewMessage = async (payload:{
    text?:string,
    image?:string,
    chat:string,
    sender:string,
}) => {
    try {
        const newMessage = new MessageModel(payload)
        await newMessage.save()
        await ChatModel.findByIdAndUpdate(payload.chat, {
            lastMessage: newMessage._id
        })
        return {message: "Message sent successfully"}
    } catch (error:any) {
        return {error: error.message}
        
    }
}