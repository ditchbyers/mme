'use client'
import React, { useEffect } from "react";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton} from '@clerk/nextjs'
import { GetCurrentUserFromMongoDB } from "@/server-actions/users";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

function Header() {

    const [currentUser , setCurrentUser] = React.useState<any>(null);

    const getCurrentUser = async () => {
        try {
            const response = await GetCurrentUserFromMongoDB();
            if (response.error) throw new Error(response.error);
            setCurrentUser(response);
        } catch (error: any) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        getCurrentUser();
    }, []);

    return (
        <header className="bg-gray-200 flex h-16 items-center justify-between px-4 shadow-md">
            <div>
                <h1 className="text-xl font-bold">Matchmaking Enabled</h1>
            </div>
            <div className="flex gap-4">
                <SignedOut>
                    <SignInButton />
                    <SignUpButton />
                </SignedOut>
                <SignedIn>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm">{currentUser?.userName}</span>
                        <Avatar>
                            <AvatarImage src={currentUser?.profilePicture} alt="User Avatar" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        {/*<UserButton></UserButton>*/}
                    </div>
                </SignedIn>
            </div>
        </header>
    );
}

export default Header;