import firebaseApp from "@/config/firebase-config";
import {getStorage, uploadBytes, ref , getDownloadURL} from "firebase/storage";

export const UploadImageToFirebaseAndReturnUrl = async (file: File) => {
    try {
        const storage = getStorage(firebaseApp);
        const storageRef = ref(storage, 'images/' + file.name);
        const uploadedImageResponse = await uploadBytes(storageRef, file);
        const downloadeURL = await getDownloadURL(uploadedImageResponse.ref);
        return downloadeURL;
    } catch (error: any) {
       throw new Error("Error initializing Firebase Storage: " + error);
    }
}