import { User } from "../Models/User.models.js";


const deleteOldAvatar = async (userId) => {
    // Retrieve the current user
    const user = await User.findById(userId);

    // Delete the old avatar from Cloudinary
    if (user && user.avatar) {
        const urlParts = user.avatar.split('/'); // string mein jaha bhi / ata h waha se split karke arr return
        const imageId = urlParts[urlParts.length - 1].split('.')[0];// ab array ka last index hoga publicId.jpg
        await cloudinary.uploader.destroy(imageId); //publicId ki madat se destroy
    }

    
};

export default deleteOldAvatar;