import axios from "axios";
import * as fs from "fs";

const PIXO_API_KEY = process.env.PIXO_API_KEY; // Set your Pixo API key in env

export async function sendToPixo(imagePath: string) {
  const imageData = fs.readFileSync(imagePath);

  const response = await axios.post(
    "https://api.pixoeditor.com/v1/edit",
    imageData,
    {
      headers: {
        "Content-Type": "image/png", // or image/jpeg
        "Authorization": `Bearer ${PIXO_API_KEY}`,
      },
      responseType: "arraybuffer", // Get binary data back
    }
  );

  fs.writeFileSync("pixo-edited-image.png", response.data);
  console.log("Edited image saved as pixo-edited-image.png");
}