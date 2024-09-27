import express from "express";
import {GoogleGenerativeAI} from "@google/generative-ai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const app = express();
const port = 3000;
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro-002",
    systemInstruction: "Never use markdown formatting or any other formatting, return your answer in raw JSON.",
});

app.use(express.json({limit: "50mb"}));

app.post("/api/analyze-okey", async (req, res) => {
    try {
        const {image, number, color} = req.body;

        if (!image || !number || !color) {
            res.status(400).json({error: "Missing required fields"});
            return;
        }

        // Ensure the image is a proper base64 string
        const parts = image.split(",");
        let base64Data = parts[1].split(/[^\w\+\/=]+/)[0];
        let mimeType = parts[0].split(":")[1].split(";")[0];

        const prompt =
            "Take the given image of a rack for the popular Turkish game 'okey', detect and identifiy each and every one of the pieces. Identify each piece by its number and color. Do not hallucinate new pieces. If the piece has a symbol instead of number pass 'fake_okey' as a value for color. If the piece has nothing on it, it is a joker, pass 'joker' as a value for color. Give your answer in pure json format. Keep in mind that colors can only be {red, black, blue, yellow} and numbers are between 1-13";

        const imageData = {
            inlineData: {
                data: base64Data,
                mimeType: mimeType,
            },
        };

        const result = await model.generateContent([prompt, imageData]);

        // Clean the markdown
        const cleanJsonString = result.response.text().replace("```json", "").replaceAll("`", "").replaceAll("\n", "");

        const pieces = JSON.parse(cleanJsonString);

        console.log(pieces);

        res.status(200).json(pieces);
    } catch (error) {
        console.error("Error processing the image:", error);
        res.status(500).json({error: "Internal server error"});
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
