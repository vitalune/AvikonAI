import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import readlineSync from "readline-sync"; 


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,});



async function imageRaw() {
  const userInput = readlineSync.question("What image would you like to generate? ");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image", 
    contents: [
      {
        role: "user",
        parts: [{ text: userInput }],
      },
    ],
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const buffer = Buffer.from(part.inlineData.data, "base64");
      fs.writeFileSync("gemini-native-image.png", buffer);
      console.log("Image saved as gemini-native-image.png");
    }
  }
}


async function imageUser() {
  const imagePath = readlineSync.question("Enter path to reference image (e.g., ./cat.png): ");
  const imageData = fs.readFileSync(imagePath);
  const base64Image = imageData.toString("base64");

  const userInput = readlineSync.question("What would you like to generate with this image? ");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image", 
    contents: [
      {
        role: "user",
        parts: [
          { text: userInput },
          {
            inlineData: {
              mimeType: "image/png", 
              data: base64Image,
            },
          },
        ],
      },
    ],
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const buffer = Buffer.from(part.inlineData.data, "base64");
      fs.writeFileSync("gemini-native-image.png", buffer);
      console.log("Image saved as gemini-native-image.png");
    }
  }
}
