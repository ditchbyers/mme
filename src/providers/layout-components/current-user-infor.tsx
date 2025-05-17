import { UserType } from "@/interfaces";
import React from "react";
import { Divider, Drawer } from "antd";

function CurrentUserInfo({
    currentUser,
    showCurrentUserInfo,
    setShowCurrentUserInfo,
}: {
    currentUser: UserType
    showCurrentUserInfo: boolean
    setShowCurrentUserInfo: React.Dispatch<React.SetStateAction<boolean>>
}) {

    const getProperty = (key:string , value:string) => {
        return <div className= "flex flex-col">
            <span className="font-semibold text-gray-700">{key}</span>
            <span className="text-gray-600">{value}</span>
        </div>
    }

    return (
        <Drawer
            open={showCurrentUserInfo}
            onClose={() => setShowCurrentUserInfo(false)}
            title="Profile"
        >
            <div className="flex flex-col gap-5">
            
                <div className="flex flex-col gap-5 justyfy-center items-center">
                    <img
                        src={currentUser?.profilePicture}
                        alt="Profile Picture"
                        className="w-28 h-28 rounded-full"
                    />
                    <span className="text-gray-500 cursor-pointer">
                        Change Profile Picture
                    </span>
                </div>

                <Divider className="my-1 border-gray-200" />


                <div className ="flex flex-col gap-5">
                    {getProperty("Name", currentUser?.name)}
                    {getProperty("Username", currentUser?.userName)}
                    {getProperty("Email", currentUser?.email)}
                    {getProperty("Bio", currentUser?.bio)}
                    {getProperty("Location", currentUser?.location)}
                    {getProperty("Games", currentUser?.games.join(", "))}

                </div>

                <div></div>

            </div>
        </Drawer>
    )
}

export default CurrentUserInfo;