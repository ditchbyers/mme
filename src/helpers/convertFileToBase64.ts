/**
 * Converts a File object to a Base64 encoded string
 * 
 * @param file - The File object to convert
 * @returns Promise that resolves to a Base64 encoded string (data URL format)
 * @throws Error if file reading fails
 */
const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

export default convertFileToBase64;