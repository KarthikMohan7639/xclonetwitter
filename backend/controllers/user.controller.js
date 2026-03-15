import User from "../models/user.model.js";
export const getProfile = async (req, res) => {
    try {
        const {username} = req.params;
        const user = await User.findOne({username}).select("-password");
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
        const userToModify = await User.findById({_id: id});
        const currentUser = await User.findById({_id: req.user.id});
        if(id === req.user._id){
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
            res.status(200).json({ message: "User followed successfully" });

        }
    } catch (error) {
        console.error(`Error in followUnfollowUser controller: ${error}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
}