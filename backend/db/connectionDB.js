
import mongoose from "mongoose";

const connectionDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to database successfully");
    }
    catch(error){
        console.log(`Error connecting to database: ${error}`);
        process.exit(1);
    }
}
export default connectionDB;