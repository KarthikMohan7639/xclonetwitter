import User from "../models/User.js";
import bcrypt from "bcryptjs";


export const signup = async (req, res) => {
    try{
        const { username, fullName, email, password } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({ message: "Invalid email format" });
        }
        const existingEmail = await User.findOne({ email });
        const existingUsername = await User.findOne({ username });
        if(existingEmail){
            return res.status(400).json({ message: "Email already exists" });
        }
        if(existingUsername){
            return res.status(400).json({ message: "Username already exists" });
        }
        if(password.length < 6){
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        // Hash the password before saving to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            username,
            fullName,
            email,
            password : hashedPassword
        });
        if(newUser){
            await newUser.save();
            res.status(200).json({
                _id : newUser._id,
                username: newUser.username,
                fullName: newUser.fullName,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg : newUser.profileImg,
                coverImg : newUser.coverImg,
                bio: newUser.bio,
                link : newUser.link

            });
        }
        else{
            res.status(400).json({error : "Invalid"});
        }


    }
    catch(err){
        console.error(`Error in signup controller: ${err}`);
        res.status(500).json({ message: "Server error" });
    }
}
export const login = async (req, res) => {
    try{

    }
    catch(err){
        console.error(`Error in login controller: ${err}`);
        res.status(500).json({ message: "Server error" });
    }
}
export const logout = (req, res) => {
    res.send("Logout controller");
}
