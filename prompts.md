1. Error:  GoogleGenerativeAIFetchError: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent: [404 Not Found] models/gemini-1.5-flash is not found for API version v1beta, or is not supported for generateContent. Call ModelService.ListModels to see the list of available models and their supported methods.
    at handleResponseNotOk (file:///D:/InternShip%20Projects/Cover%20Letter/Backend/node_modules/@google/generative-ai/dist/index.mjs:432:11)
    at process.processTicksAndRejections (node:internal/process/task_queues:103:5)
    at async makeRequest (file:///D:/InternShip%20Projects/Cover%20Letter/Backend/node_modules/@google/generative-ai/dist/index.mjs:401:9)
    at async generateContent (file:///D:/InternShip%20Projects/Cover%20Letter/Backend/node_modules/@google/generative-ai/dist/index.mjs:865:22)
    at async file:///D:/InternShip%20Projects/Cover%20Letter/Backend/Routes/userRoutes.js:25:24 {
  status: 404,
  statusText: 'Not Found',
  errorDetails: undefined
}                                                 router.post('/generate', async (req, res) => {
    try {
        // console.log("try block")
        // console.log("body", req.body)
        const {prompt} = req.body;
        // console.log(prompt)
        const model = ai.getGenerativeModel({
            model: "gemini-1.5-flash",
        })
        const result = await model.generateContent(prompt)

        const response = result.response.text()
        console.log(response)
    } catch (error) {
        // console.log("catch block")
        console.log("Error: ", error)
    }



2. import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import pdf from "pdf-parse";
import upload from "../middleware/upload.js";

dotenv.config();

const router = express.Router();

const ai = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

router.post(
    "/generate",
    upload.single("resume"),
    async (req, res) => {
        try {
            let prompt = "";

            // Resume uploaded
            if (req.file) {
                console.log("PDF Received:", req.file.originalname);

                const pdfData = await pdf(
                    req.file.buffer
                );

                console.log(
                    "PDF Text Length:",
                    pdfData.text.length
                );

                prompt = `
Analyze the following resume and create a professional cover letter.

Candidate Name: ${req.body.name || ""}
Target Role: ${req.body.role || ""}
Target Company: ${req.body.company || ""}
Skills: ${req.body.skills || ""}

Instructions:
- Write a professional cover letter.
- Highlight relevant skills and experience.
- Match the candidate's background with the target role.
- Keep it concise and impactful.

Resume Content:
${pdfData.text}
`;
            }

            // No resume uploaded
            else {
                prompt = req.body.prompt;

                if (!prompt) {
                    return res.status(400).json({
                        success: false,
                        message: "Prompt is required",
                    });
                }
            }

            const model =
                ai.getGenerativeModel({
                    model: "gemini-2.5-flash-lite",
                });

            const result =
                await model.generateContent(prompt);

            const response =
                result.response.text();

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

export default router;                                              PS D:\InternShip Projects\Cover Letter\Backend> nodemon
[nodemon] 3.1.11
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node index.js`
node:fs:560
  return binding.open(
                 ^

Error: ENOENT: no such file or directory, open 'D:\InternShip Projects\Cover Letter\Backend\test\data\05-versions-space.pdf'
    at Object.openSync (node:fs:560:18)
    at Object.readFileSync (node:fs:444:35)
    at Object.<anonymous> (D:\InternShip Projects\Cover Letter\Backend\node_modules\pdf-parse\index.js:15:25)
    at Module._compile (node:internal/modules/cjs/loader:1761:14)
    at Object..js (node:internal/modules/cjs/loader:1893:10)
    at Module.load (node:internal/modules/cjs/loader:1481:32)
    at Module._load (node:internal/modules/cjs/loader:1300:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at loadCJSModuleWithModuleLoad (node:internal/modules/esm/translators:336:3) {
  errno: -4058,
  code: 'ENOENT',
  syscall: 'open',
  path: 'D:\\InternShip Projects\\Cover Letter\\Backend\\test\\data\\05-versions-space.pdf'
}

Node.js v24.11.1
[nodemon] app crashed - waiting for file changes before starting...      

3. PS D:\InternShip Projects\Cover Letter\Backend> Get-Content .\node_modules\pdf-parse\index.js
const Fs = require('fs');
const Pdf = require('./lib/pdf-parse.js');

module.exports = Pdf;

let isDebugMode = !module.parent;

//process.env.AUTO_KENT_DEBUG


//for testing purpose
if (isDebugMode) {

    let PDF_FILE = './test/data/05-versions-space.pdf';
    let dataBuffer = Fs.readFileSync(PDF_FILE);
    Pdf(dataBuffer).then(function(data) {
        Fs.writeFileSync(`${PDF_FILE}.txt`, data.text, {
            encoding: 'utf8',
            flag: 'w'
        });
        debugger;
    }).catch(function(err) {
        debugger;
    });

}
