import express from "express";
import {GoogleGenerativeAI} from "@google/generative-ai";
import dotenv from "dotenv";
import {SimulatedAnnealing, Mutation} from "./heuristic-okey-solver.js";

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

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post("/api/process-image", async (req, res) => {
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
            "Take the given image of a rack for the popular Turkish game 'okey', detect and identifiy each and every one of the pieces. Identify each piece by its number and color. Do not hallucinate new pieces. If the piece has a symbol instead of number pass 'fake_okey' as a value for color. If the piece has nothing on it, it is an okey, pass 'okey' as a value for color. Give your answer in pure json format. Keep in mind that colors can only be {red, black, blue, yellow} and numbers are between 1-13";

        const imageData = {
            inlineData: {
                data: base64Data,
                mimeType: mimeType,
            },
        };

        const result = await model.generateContent([prompt, imageData]);

        // Clean the markdown
        const cleanJsonString = result.response.text().replace("```json", "").replaceAll("`", "").replaceAll("\n", "");

        // Get the pieces
        const pieces = JSON.parse(cleanJsonString);

        // Scramble mutation gives the best results
        const sa = new SimulatedAnnealing(100000, 0.99, Mutation.scramble, pieces, color, number);
        const bestHand = sa.run();

        // Merge subarrays with size less than 3
        let mergedHand = [];
        let tempArr = [];

        for (let group of bestHand) {
            if (group.length < 3) {
                tempArr = tempArr.concat(group);
            } else {
                mergedHand.push(group);
            }
        }

        // Sort the merged hand by group size (larger groups came first)
        mergedHand.sort((a, b) => b.length - a.length);

        // If there are remaining pieces in tempArr, push them as a single group
        if (tempArr.length > 0) mergedHand.push(tempArr);

        res.status(200).json({hand: mergedHand, score: sa.calculateFitness(bestHand)});
    } catch (error) {
        console.error("Error processing the image:", error);
        res.status(500).json({error: "Internal server error"});
    }
});

app.post("/api/test", async (req, res) => {
    const bestHand = [
        [
            {
                color: "red",
                number: 5,
                type: "piece",
            },
            {
                color: "red",
                number: 6,
                type: "piece",
            },
            {
                color: "red",
                number: 7,
                type: "piece",
            },
        ],
        [
            {
                color: "red",
                number: 6,
                type: "piece",
            },
            {
                color: "red",
                number: 7,
                type: "piece",
            },
            {
                color: "red",
                number: 8,
                type: "piece",
            },
        ],
        [
            {
                color: "red",
                number: 12,
                type: "piece",
            },
            {
                color: "red",
                number: 13,
                type: "piece",
            },
            {
                color: "black",
                number: 5,
                type: "piece",
            },
            {
                color: "black",
                number: 11,
                type: "piece",
            },
            {
                color: "black",
                number: 9,
                type: "piece",
            },
            {
                color: "black",
                number: 10,
                type: "piece",
            },
            {
                color: "black",
                number: 11,
                type: "piece",
            },
            {
                color: "black",
                number: 12,
                type: "okey",
            },
        ],
        [
            {
                color: "blue",
                number: 7,
                type: "piece",
            },
            {
                color: "orange",
                number: 7,
                type: "piece",
            },
            {
                color: "black",
                number: 7,
                type: "piece",
            },
        ],
        [
            {
                color: "black",
                number: 2,
                type: "piece",
            },
            {
                color: "black",
                number: 3,
                type: "piece",
            },
            {
                color: "black",
                number: 4,
                type: "piece",
            },
            {
                color: "black",
                number: 5,
                type: "fake_okey",
            },
        ],
    ];

    res.status(200).json({hand: bestHand, score: 105});
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
