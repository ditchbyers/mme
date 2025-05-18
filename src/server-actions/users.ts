'use server';
import { connectMongoDB } from "@/config/db-config";
import UserModel from "@/models/user-model";
import { currentUser } from "@clerk/nextjs/server";

connectMongoDB();


export const GetCurrentUserFromMongoDB = async () => {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) {
            return { error: "User not authenticated." };
        }
        // check if user is already in db based on clerkUserId
        const mongoUser = await UserModel.findOne({ clerkUserId: clerkUser?.id });
        if (mongoUser) {
            return JSON.parse(JSON.stringify(mongoUser));
        }
        //if the user is not in the db, create a new user
        let email = "";
        if (clerkUser?.emailAddresses) {
            email = clerkUser?.emailAddresses[0]?.emailAddress || "";
        }

        const newUserPayload = {
            clerkUserId: clerkUser?.id,
            name: [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" "),
            userName: clerkUser?.username,
            email,
            profilePicture: clerkUser?.imageUrl
        };

        const newUser = await UserModel.create(newUserPayload);
        return JSON.parse(JSON.stringify(newUser));
    } catch (error: any) {
        return {
            error: error.message
        }
    }
}

export const GetAllUsers = async () => {
    try {
        const users = await UserModel.find();
        return JSON.parse(JSON.stringify(users));
    } catch (error: any) {
        return {
            error: error.message
        }
    }
}

export const UpdateUserProfile = async (userId: string, payload: any) => {
    try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, payload, { new: true });
    return JSON.parse(JSON.stringify(updatedUser));
    }
    catch (error: any) {
        return {
            error: error.message
        }
    }}