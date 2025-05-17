'use client'
import React, { useEffect } from "react";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton} from '@clerk/nextjs'
import { GetCurrentUserFromMongoDB } from "@/server-actions/users";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserType } from "@/interfaces";
import CurrentUserInfo from "./current-user-infor";

function Header() {

    const [currentUser , setCurrentUser] = React.useState<UserType | null>(null);
    const [showCurrentUserInfo, setShowCurrentUserInfo] = React.useState(false);

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
        <header className="bg-gray-200 w-full h-16 py-1 flex items-center justify-between px-5 border-b border-solid border-gray-300">
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
                        <span className="font-bold text-sm">{currentUser?.userName}</span>
                        <Avatar className="cursor-pointer" onClick={() => setShowCurrentUserInfo(true)}>
                            <AvatarImage src={currentUser?.profilePicture} alt="User Avatar" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        {/*<UserButton></UserButton>*/}
                    </div>

                    {showCurrentUserInfo && currentUser && (
                        <CurrentUserInfo
                            currentUser={currentUser}
                            setShowCurrentUserInfo={setShowCurrentUserInfo}
                            showCurrentUserInfo={showCurrentUserInfo}
                        />
                    )}
                </SignedIn>
            </div>
        </header>
    );
}

export default Header;