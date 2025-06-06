'use server';
import { currentUser, auth} from "@clerk/nextjs/server";

export const GetCurrentUserFromMongoDB = async () => {
    try {
        
        const {  sessionId, userId } = await auth()
        const clerkUser = await currentUser();
        //console.log("Clerk User:", clerkUser);
        
        if (!clerkUser) {
            return { error: "User not authenticated." };
        }
        // check if user is already in db based on clerkUserId
        //console.log("Session ID:", sessionId);
        //console.log("User ID:", userId);
/*
        const mongoUser = await UserModel.findOne({ clerkUserId: clerkUser?.id });
        if (mongoUser) {
            console.log("User found in MongoDB:", mongoUser);
            return JSON.parse(JSON.stringify(mongoUser));
        }*/

        //if the user is not in the db, create a new user
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

        /*const newUser = await UserModel.create(newUserPayload);
        console.log("New user created:", newUser);
        return JSON.parse(JSON.stringify(newUser));*/
        

    } catch (error: any) {
        return {
            error: error.message
        }
    }
}


export const UpdateUserProfile = async (currentUserId: any, payload: any) => {
    try {
        //const updatedUser = await UserModel.findByIdAndUpdate(userId, payload, { new: true });
        //return JSON.parse(JSON.stringify(updatedUser));

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
        //const users = await UserModel.find({});
        //return JSON.parse(JSON.stringify(users));
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