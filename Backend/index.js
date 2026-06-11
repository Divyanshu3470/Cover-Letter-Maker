import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./Routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(
    cors({
        origin: [
            "https://coverletter-maker.netlify.app",
            "http://localhost:5500",
            "http://127.0.0.1:5500"
        ]
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend is running");
});

app.use("/api", userRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;