'use server';
import { currentUser, auth } from "@clerk/nextjs/server";

export const GetCurrentUserFromMongoDB = async () => {
    try {

        const { sessionId, userId } = await auth()
        const clerkUser = await currentUser();

        if (!clerkUser) {
            return { error: "User not authenticated." };
        }
        let email = "";
        if (clerkUser?.emailAddresses) {
            email = clerkUser?.emailAddresses[0]?.emailAddress || "";
        }

        const newUserPayload = {
            session_token: [sessionId],
            clerkUserId: clerkUser?.id,
            name: [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" "),
            userName: clerkUser?.username,
            email,
            profilePicture: clerkUser?.imageUrl
        };

        const response = await fetch(`${process.env.DEV_URL}/user/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUserPayload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Error creating user:", data.error);
            return { error: data.error || "Unknown error occurred" };
        }
        return data;

    } catch (error: any) {
        return {
            error: error.message
        }
    }
}


export const UpdateUserProfile = async (currentUserId: any, payload: any) => {
    try {

        const { sessionId } = await auth();
        const currentUser = currentUserId
        console.log("Current User ID:", currentUser);
        const response = await fetch(`${process.env.DEV_URL}/user/self/profile?user_id=${currentUser}&session_token=${sessionId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Error updating user:", data.error);
            return { error: data.error || "Unknown error occurred" };
        }

        return data;

    }
    catch (error: any) {
        return {
            error: error.message
        }
    }
}

export const GetAllUsers = async () => {
    try {

        const response = await fetch(`${process.env.DEV_URL}/user/profiles`, {
            method: "GET"
        });


        const data = await response.json();
        if (!response.ok) {
            console.error("Error fetching users:", data.error);
            return { error: data.error || "Unknown error occurred" };
        }
        return data;

    } catch (error: any) {
        return {
            error: error.message
        }
    }
}