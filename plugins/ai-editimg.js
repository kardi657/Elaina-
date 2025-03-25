/*
Jangan Hapus Wm Bang 

*Edit Image  Plugins Esm*

Ya Gitu Gambar Nya Di Edit 

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Source Func]*

https://whatsapp.com/channel/0029Vb9ZfML6GcGFm9aPgh0W/118
*/

import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";
  
  if (!mime) return m.reply(`Kirim/reply gambar dengan caption *${usedPrefix + command}* prompt`);
  if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`Format ${mime} tidak didukung! Hanya jpeg/jpg/png`);
  if (!text) return m.reply(`Masukkan prompt yang jelas!\n\nContoh: *${usedPrefix + command}* ubah latar belakang menjadi pantai`);
  
  let promptText = text;
  await global.loading(m, conn);
  try {
    let imgData = await q.download();
    let genAI = new GoogleGenerativeAI("AIzaSyDdfNNmvphdPdHSbIvpO5UkHdzBwx7NVm0");
    
    const base64Image = imgData.toString("base64");
    
    const contents = [
      { text: promptText },
      {
        inlineData: {
          mimeType: mime,
          data: base64Image
        }
      }
    ];
    
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        responseModalities: ["Text", "Image"]
      },
    });
    
    const response = await model.generateContent(contents);
    
    let resultImage;
    let resultText = "";
    
    for (const part of response.response.candidates[0].content.parts) {
      if (part.text) {
        resultText += part.text;
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        resultImage = Buffer.from(imageData, "base64");
      }
    }
    
    if (resultImage) {
      const tempPath = path.join(process.cwd(), "tmp", `gemini_${Date.now()}.png`);
      fs.writeFileSync(tempPath, resultImage);
      
      await conn.sendMessage(m.chat, { 
        image: { url: tempPath },
      }, { quoted: m });
      
      setTimeout(() => {
        try {
          fs.unlinkSync(tempPath);
        } catch {}
      }, 30000);
    } else {
      m.reply("Gagal menghasilkan gambar.");
    }
  } catch (error) {
    console.error(error);
    m.reply(`Error: ${error.message}`);
  }
};

handler.help = ["editimg"];
handler.tags = ["ai"];
handler.command = ["editimg"];

export default handler;