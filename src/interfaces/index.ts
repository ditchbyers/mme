
export interface UserType {
    _id: string;
    ckerkUserId: string;
    name: string;
    userName: string;
    email: string;
    profilePicture: string;
    bio: string;
    location: string;
    platform: string;
    language: string;
    games: string[];
    }

    export interface ChatType {
        _id: string;
        users: UserType[];
        createdBy: UserType;
        lastMessage: MessageType;
        isGroupChat: boolean;
        groupName: string;
        groupProfilePicture: string;
        groupBio: string;
        groupAdmins: string[];
        unreadCounts: object;
        createdAt: string;
        updatedAt: string;

    }

    export interface MessageType {
        _id: string;
        chat: ChatType;
        sender: UserType;
        text: string;
        image: string;
        readBy: UserType[];
        createdAt: string;
        updatedAt: string;
    }