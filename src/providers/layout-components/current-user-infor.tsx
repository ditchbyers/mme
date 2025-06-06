import React, { useRef } from "react";
import { Divider, Drawer, Upload } from "antd";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { SetCurrentUser, UserState } from "@/redux/userSlice";
import { UploadImageToFirebaseAndReturnUrl } from "@/helpers/image-upload";
import { UpdateUserProfile } from "@/server-actions/users";
import socket from "@/config/socket-config";
import { Pencil } from "lucide-react";
import convertFileToBase64 from "@/helpers/convertFileToBase64";


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
    const [editableFields, setEditableFields] = React.useState({
        name: currentUserData?.name || "",
        userName: currentUserData?.userName || "",
        bio: currentUserData?.bio || "",
        location: currentUserData?.location || "",
        language: currentUserData?.language || "",
        platforms: currentUserData?.platforms || [""],
    });

    const isChanged =
        selectedFile !== null ||
        JSON.stringify(editableFields) !== JSON.stringify({
            name: currentUserData?.name || "",
            userName: currentUserData?.userName || "",
            bio: currentUserData?.bio || "",
            location: currentUserData?.location || "",
            language: currentUserData?.language || "",
            platforms: currentUserData?.platforms || [""],
        });

    const isEditableText = (key: string) =>
        ["Name", "Username", "Bio"].includes(key);

    const isDropdown = (key: string) =>
        ["Location", "Language", "Platforms"].includes(key);

    const getPropertyKey = (label: string): keyof typeof editableFields => {
        const map: any = {
            Name: "name",
            Username: "userName",
            Bio: "bio",
            Location: "location",
            Language: "language",
            Platforms: "platforms",
        };
        return map[label];
    };

    const [editingField, setEditingField] = React.useState<string | null>(null);

    const getProperty = (label: string, value: string) => {
        const fieldKey = getPropertyKey(label);

        const renderValue = () => {
            if (editingField === label) {
                if (isEditableText(label)) {
                    return (
                        <input
                            type="text"
                            value={editableFields[fieldKey]}
                            onChange={(e) =>
                                setEditableFields({ ...editableFields, [fieldKey]: e.target.value })
                            }
                            className="border p-1 rounded"
                        />
                    );
                } else if (isDropdown(label)) {
                    const options = {
                        Location: ["Germany", "USA", "UK", "Other"],
                        Language: ["German", "English", "French"],
                        Platforms: ["PC", "PlayStation", "Xbox", "Switch"],
                    };
                    return (
                        <select
                            multiple={label === "Platforms"}
                            value={editableFields[fieldKey]}
                            onChange={(e) => {
                                const selected = label === "Platforms"
                                    ? Array.from(e.target.selectedOptions).map(opt => opt.value)
                                    : e.target.value;
                                setEditableFields({ ...editableFields, [fieldKey]: selected });
                            }}
                            className="border p-1 rounded"
                        >
                            {(options[label as keyof typeof options] as string[]).map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    );
                }
            }

            return <span className="text-gray-600">{value}</span>;
        };

        return (
            <div className="flex flex-col">
                <div className="group flex items-center gap-2">
                    <span className="font-semibold text-gray-700 cursor-pointer">{label}</span>
                    {(isEditableText(label) || isDropdown(label)) && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white hover:bg-transparent border border-white hover:border-gray-700 rounded"
                            onClick={() => setEditingField(editingField === label ? null : label)}
                        >
                            <Pencil className="w-4 h-4 text-gray-500 hover:text-black" />
                        </Button>
                    )}
                </div>
                {renderValue()}
            </div>
        );
    };



    const onLogout = async () => {
        try {
            setLoading(true);
            socket.emit("logout", currentUserData?.id);
            await signOut();
            setShowCurrentUserInfo(false);
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

    const onUpdateProfile = async () => {
        try {
            setLoading(true);
            console.log("currentUserData: ", currentUserData);
            let profilePictureBase64 = currentUserData?.profilePicture;

            if (selectedFile) {
                profilePictureBase64 = await convertFileToBase64(selectedFile);
            }

            const payload = {
                ...editableFields,
                profilePicture: profilePictureBase64,
            };
            console.log("Payload for update: ", payload);
            const response = await UpdateUserProfile(currentUserData?.id!, payload);
            console.log("Response from update: ", response);
            if (response.error) throw new Error(response.error);

            dispatch(SetCurrentUser({ ...currentUserData, ...response }));
        } catch (error: any) {
            console.error("Error saving :  ", error);
        } finally {
            setLoading(false);
            setSelectedFile(null);
            setEditingField(null);
        }
    };

    React.useEffect(() => {
        if (showCurrentUserInfo && currentUserData) {
            setEditableFields({
                name: currentUserData.name || "",
                userName: currentUserData.userName || "",
                bio: currentUserData.bio || "",
                location: currentUserData.location || "",
                language: currentUserData.language || "",
                platforms: currentUserData.platforms || [""],
            });
        }
    }, [showCurrentUserInfo, currentUserData]);

    return (
        <>
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
                            Change Profile Picture
                        </Upload>

                    </div>

                    <Divider className="my-1 border-gray-200" />


                    <div className="flex flex-col gap-5">
                        <div>
                            {getProperty("Name", currentUserData?.name)}
                        </div>
                        <div>
                            {getProperty("Username", currentUserData?.userName)}
                        </div>
                        <div>
                            {getProperty("Email", currentUserData?.email)}
                        </div>
                        <div>
                            {getProperty("Bio", currentUserData?.bio || "")}
                        </div>
                        <div>
                            {getProperty("Location", currentUserData?.location || "")}
                        </div>
                        <div>
                            {getProperty("Language", currentUserData?.language || "")}
                        </div>
                        <div>
                            {getProperty("Games", currentUserData?.games?.join(", ") || "")}
                        </div>
                        <div>
                            {getProperty("Platforms", currentUserData?.platforms?.join(", ") || "")}
                        </div>


                    </div>
                    <div className="flex flex-col gap-5">
                        <Button
                            className="w-full"
                            onClick={onUpdateProfile}
                            disabled={!isChanged}
                        >
                            Update Profile
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