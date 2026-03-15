import express from 'express';
import dotenv from 'dotenv';
import authRoute from "./routes/auth.route.js";
import connectionDB from './db/connectionDB.js';
import dns from "node:dns";
import cookieParser from 'cookie-parser';
import userRoute from './routes/user.route.js';


dotenv.config();

// Use Google DNS to resolve MongoDB Atlas SRV records
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());



app.use("/api/auth",authRoute)
app.use("/api/users",userRoute)

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectionDB();
});