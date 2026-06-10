import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import pdf from "pdf-parse";
import upload from "../middleware/upload.js";

dotenv.config();

const router = express.Router();

const ai = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

router.post("/generate", upload.single("resume"), async (req, res) => {
    try {
        let prompt = "";
        if (req.file) {
            console.log("PDF Received:", req.file.originalname);

            const pdfData = await pdf(
                req.file.buffer
            );
            console.log(
                "PDF Text Length:",
                pdfData.text.length
            );
            prompt = `Analyze the following resume and create a professional cover letter.
                Candidate Name: ${req.body.name || ""}
                Target Role: ${req.body.role || ""}
                Target Company: ${req.body.company || ""}
                Skills: ${req.body.skills || ""}

                Resume Content: ${pdfData.text}`;
        }
        else {
            prompt = req.body.prompt;
            if (!prompt) {
                return res.status(400).json({
                    success: false,
                    message: "Prompt is required",
                });
            }
        }

        const model = ai.getGenerativeModel({
                model: "gemini-2.5-flash",
            });

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        return res.status(200).json({
            success: true,
            response,
        });
    } catch (error) {
        console.error(
            "Generate Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to Generate Cover Letter",
            error: error.message,
        });
    }
}
);

export default router;