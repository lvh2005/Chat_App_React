// uploadFile.js
const uploadFile = async (file) => {
    // Kiểm tra file hợp lệ
    if (!file) {
        console.error("No file provided");
        return null;
    }
    
    const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/auto/upload`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'chat-app-file');

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        console.log("Upload result:", result);
        
        if (response.ok && result.secure_url) {
            return result;
        } else {
            console.error("Upload failed:", result);
            return null;
        }
    } catch (error) {
        console.error("Error uploading file:", error);
        return null;
    }
};

export default uploadFile;
