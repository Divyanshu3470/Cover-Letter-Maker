import express from 'express'
import cors from 'cors'
import { GoogleGenerativeAI } from '@google/generative-ai';
import userRoutes from "./Routes/userRoutes.js";


const app = express()

app.use(cors());
app.use(express.json())
app.use("/api", userRoutes);

app.listen(8000 , (req, res)=>{
    console.log("server is running")
})

export default app