import axios from "axios";
import * as fs from "fs";

const PIXO_API_KEY = process.env.PIXO_API_KEY;

export async function sendToPixo(imagePath: string) {
  const imageData = fs.readFileSync(imagePath);

  const response = await axios.post(
    "https://pixoeditor.com/api/image",
    imageData,
    {
      headers: {
        "Content-Type": "image/png",
        "Authorization": `Bearer ${PIXO_API_KEY}`, // TODO: Replace with actual API key
      },
      responseType: "arraybuffer",
    }
  );

  fs.writeFileSync("pixo-edited-image.png", response.data);
  console.log("Edited image saved as pixo-edited-image.png");
}