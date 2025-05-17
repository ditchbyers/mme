import { UserType } from "@/interfaces";
import React from "react";
import { Divider, Drawer, Button} from "antd";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

function CurrentUserInfo({
    currentUser,
    showCurrentUserInfo,
    setShowCurrentUserInfo,
}: {
    currentUser: UserType
    showCurrentUserInfo: boolean
    setShowCurrentUserInfo: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const [loading, setLoading] = React.useState(false);
    const { signOut } = useClerk();
    const router = useRouter();

    const getProperty = (key: string, value: string) => {
        return <div className="flex flex-col">
            <span className="font-semibold text-gray-700">{key}</span>
            <span className="text-gray-600">{value}</span>
        </div>
    }

    const onLogout = async () => {
        try {
            setLoading(true);
            await signOut();
            setShowCurrentUserInfo(false);
            router.push("/");
        } catch (error: any) {
            console.error("Error signing out: ", error);
        }
        finally {
            setLoading(false);
        }
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


                <div className="flex flex-col gap-5">
                    {getProperty("Name", currentUser?.name)}
                    {getProperty("Username", currentUser?.userName)}
                    {getProperty("Email", currentUser?.email)}
                    {getProperty("Bio", currentUser?.bio)}
                    {getProperty("Location", currentUser?.location)}
                    {getProperty("Games", currentUser?.games.join(", "))}

                </div>

                <div className="mt-5">
                    <Button className="w-full" block
                        loading={loading}
                        onClick={onLogout}
                    >
                        Logout
                    </Button>
                </div>

            </div>
        </Drawer>
    )
}

export default CurrentUserInfo;