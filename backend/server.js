import express from 'express';
import dotenv from 'dotenv';
import authRoute from "./routes/auth.route.js";
import connectionDB from './db/connectionDB.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use("/api/auth",authRoute)

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectionDB();
});