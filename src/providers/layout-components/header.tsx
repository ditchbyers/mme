'use client'
import React, { useEffect } from "react";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'
import { GetCurrentUserFromMongoDB } from "@/server-actions/users";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import CurrentUserInfo from "./current-user-infor";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { SetCurrentUser, UserState } from "@/redux/userSlice";
import { UserType } from "@/interfaces";

function Header() {

    
    const pathname = usePathname();
    const isPublicRoute = pathname.includes("sign-in") || pathname.includes("sign-up");
    const { isSignedIn } = useUser();
    if (isPublicRoute) return null;

    const dispatch = useDispatch();
    const {currentUserData}: UserState = useSelector((state: any) => state.user);
    const [showCurrentUserInfo, setShowCurrentUserInfo] = React.useState(false);

    useEffect(() => {
        const getCurrentUser = async () => {
            if (!isSignedIn) return;
            try {
                const response = await GetCurrentUserFromMongoDB();
                if (response.error) throw new Error(response.error);
                dispatch(SetCurrentUser(response as UserType));
            } catch (error: any) {
                console.error(error.message);
            }
        };
        getCurrentUser();
    }, [isSignedIn]);

    
    

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
                        <span className="font-bold text-sm">{currentUserData?.userName}</span>
                        <Avatar className="cursor-pointer" onClick={() => setShowCurrentUserInfo(true)}>
                            <AvatarImage src={currentUserData?.profilePicture} alt="User Avatar" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        {/*<UserButton></UserButton>*/}
                    </div>

                    {showCurrentUserInfo && currentUserData && (
                        <CurrentUserInfo
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