import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "cloudinary";

export const getProfile = async (req, res) => {
    try {
        const {username} = req.params;
        const user = await User.findOne({ username }).select("-password");
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);

    } catch (error) {
        console.error(`Error in getProfile controller: ${error}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const followUnfollowUser = async (req, res) => {
    try{
        
        const {id} = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);
        if(id === req.user._id.toString()){
            return res.status(400).json({ message: "You cannot follow/unfollow yourself" });
        }
        if(!userToModify || !currentUser){
            return res.status(404).json({ message: "User not found" });
        }
        const isFollowing = currentUser.following.includes(id);
        if(isFollowing){
            // Unfollow
            await User.findByIdAndUpdate(id, {
                $pull: { followers: req.user.id }
            });
            await User.findByIdAndUpdate(req.user.id, {
                $pull: { following: id }
            });
            res.status(200).json({ message: "User unfollowed successfully" });
        }else{
            // Follow
            await User.findByIdAndUpdate(id, {
                $push: { followers: req.user.id }
            });
            await User.findByIdAndUpdate(req.user.id, {
                $push: { following: id }
            });
            //send notification
            const newNotification = new Notification({
                type : "follow",
                from : req.user._id,
                to : userToModify._id,
            })
            await newNotification.save();
            res.status(200).json({ message: "User followed successfully" });
        }
    } catch (error) {
        console.error(`Error in followUnfollowUser controller: ${error}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        const userFollowedByMe = await User.findById(userId).select("-password");
        const users = await User.aggregate([
            {
                $match :{
                    _id : { $ne : userId }
                }
            },
            {
                $sample : {
                    size : 10
                }

            }

        ])
        const filteredUser = users.filter((user) => !userFollowedByMe.following.map(id => id.toString()).includes(user._id.toString()));
        const suggestedUsers = filteredUser.slice(0, 4);
        suggestedUsers.forEach((user) => (user.password = null));
        res.status(200).json(suggestedUsers);
    }
     catch (error) {
        console.error(`Error in getSuggestedUsers controller: ${error}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById({_id: userId });
        const {username,fullName, email, currentPassword, newPassword,bio, link } = req.body;
        const{profileImg, coverImg} = req.body

        // if(profileImg){
        //     if(user.profileImg){
        //         await cloudinary.uploader.destroy(user.profileImg.split("/").slice(-1)[0].split(".")[0]);
        //     }
        //     const uploadedResponse = await cloudinary.uploader.upload(profileImg);
        //     profileImg = uploadedResponse.secure_url;
        // }
        // if(coverImg){
        //     if(user.coverImg){
        //         await cloudinary.uploader.destroy(user.coverImg.split("/").slice(-1)[0].split(".")[0]);
        //     }
        //     const uploadedResponse = await cloudinary.uploader.upload(coverImg);
        //     coverImg = uploadedResponse.secure_url;
        // }
        user.fullName = fullName || user.fullName;
        user.username = username || user.username;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        user = await user.save();

        user.password = null;


        return res.status(200).json(user);

        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        if((!newPassword && currentPassword)||(newPassword && !currentPassword)){
            return res.status(400).json({ message: "Both current and new passwords are required" });
        }
        if(newPassword && currentPassword){
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if(!isMatch){
                return res.status(400).json({ message: "Current password is incorrect" });
            }
        }
        if(newPassword.length < 6){
            return res.status(400).json({ message: "New password must be at least 6 characters long" });
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

    } catch (error) {
        console.error(`Error in updateUser controller: ${error}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
};