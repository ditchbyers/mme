import { UserType } from "@/interfaces";
import React, { useRef } from "react";
import { Divider, Drawer, Upload } from "antd";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Toast } from 'primereact/toast';
import { useDispatch, useSelector } from "react-redux";
import { SetCurrentUser, UserState } from "@/redux/userSlice";
import { UploadImageToFirebaseAndReturnUrl } from "@/helpers/image-upload";
import { UpdateUserProfile } from "@/server-actions/users";
import socket from "@/config/socket-config";


function CurrentUserInfo({
    showCurrentUserInfo,
    setShowCurrentUserInfo,
}: {
    showCurrentUserInfo: boolean
    setShowCurrentUserInfo: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const [loading, setLoading] = React.useState(false);
    const { currentUserData }: UserState = useSelector((state: any) => state.user);

    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const { signOut } = useClerk();
    const router = useRouter();
    const dispatch = useDispatch();

    const getProperty = (key: string, value: string) => {
        return (
            <div className="flex flex-col">
                <span className="font-semibold text-gray-700">{key}</span>
                <span className="text-gray-600">{value}</span>
            </div>
        )
    }

    const toast = useRef<Toast>(null);

    const onLogout = async () => {
        try {
            setLoading(true);
            socket.emit("logout", currentUserData?._id);
            await signOut();
            setShowCurrentUserInfo(false);
            toast.current?.show({
                severity: "success",
                summary: "Logout erfolgreich",
                detail: "Du wurdest erfolgreich ausgeloggt.",
                life: 3000,
            });
            setTimeout(() => {
                router.push("/");
            }, 1500);
        } catch (error: any) {
            console.error("Error signing out: ", error);
        }
        finally {
            setLoading(false);
        }
    }

    const onProfilePictureUpload = async () => {
        // TODO: Upload the selected file to the server der speichert die bilder auf Firebase
        try {
            setLoading(true);
            const url: string = await UploadImageToFirebaseAndReturnUrl(selectedFile!);
            const response = await UpdateUserProfile(currentUserData?._id!, { profilePicture: url });
            if (response.error) throw new Error(response.error);
            dispatch(SetCurrentUser(response));
        } catch (error: any) {
            console.error("Error signing out: ", error);
        } finally {
            setLoading(false);
            setSelectedFile(null);
        }
    }

    return (
        <>
            {/*Todo: Checken warum die scheiß Success Message nicht angezeigt wird*/}
            <Toast ref={toast} />
            <Drawer
                open={showCurrentUserInfo}
                onClose={() => setShowCurrentUserInfo(false)}
                title="Profile"
            >
                <div className="flex flex-col gap-5">

                    <div className="flex flex-col gap-5 justyfy-center items-center">
                        {!selectedFile && <img
                            src={currentUserData?.profilePicture}
                            alt="Profile Picture"
                            className="w-28 h-28 rounded-full"
                        />}
                        <Upload beforeUpload={(file) => {
                            setSelectedFile(file);
                            return false;
                        }}
                            className="cursor-pointer"
                            listType={selectedFile ? "picture-circle" : "text"}
                            maxCount={1}
                        >
                            Change Profile Picture </Upload>

                    </div>

                    <Divider className="my-1 border-gray-200" />


                    <div className="flex flex-col gap-5">
                        {getProperty("Name", currentUserData?.name)}
                        {getProperty("Username", currentUserData?.userName)}
                        {getProperty("Email", currentUserData?.email)}
                        {getProperty("Bio", currentUserData?.bio)}
                        {getProperty("Location", currentUserData?.location)}
                        {getProperty("Games", currentUserData?.games.join(", "))}

                    </div>
                    <div className="flex flex-col gap-5">
                        <Button
                            className="w-full"
                            onClick={onProfilePictureUpload}
                            disabled={!selectedFile}
                        >
                            Update Profile Picture
                        </Button>

                        <Button
                            className="w-full"
                            disabled={loading}
                            onClick={onLogout}
                        >
                            {loading ? "Logging out..." : "Logout"}
                        </Button>
                    </div>
                </div>

            </Drawer>
        </>
    )
}

export default CurrentUserInfo;