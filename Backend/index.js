import express from 'express'
import cors from 'cors'
import { GoogleGenerativeAI } from '@google/generative-ai';
import userRoutes from "./Routes/userRoutes.js";
import dotenv from 'dotenv'


const app = express()

app.use(cors());
app.use(express.json())
app.use("/api", userRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT , (req, res)=>{
    console.log("server is running")
})

export default app