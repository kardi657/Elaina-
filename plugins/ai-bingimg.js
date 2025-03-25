/*

 
# Fitur : Bing Image Creator

# Type : Plugins ESM

# Created by : https://whatsapp.com/channel/0029Vb2qri6JkK72MIrI8F1Z

# Api : beta.anabot.my.id

 
   ⚠️ _Note_ ⚠️

jangan hapus wm ini banggg

 
*/

 
import fetch from 'node-fetch';

 
let handler = async (m, { text, conn }) => {

  if (!text) return m.reply('Masukkan prompt gambar!');

 
  let apiUrl = `https://beta.anabot.my.id/api/ai/bingImgCreator?prompt=${encodeURIComponent(text)}&apikey=freeApikey`;
  
  await global.loading(m, conn);

 
  try {

    let res = await fetch(apiUrl);

    let json = await res.json();

 
    if (json.status !== 200 || !json.data?.result?.length) {

      return m.reply('Gagal mendapatkan gambar, coba lagi.');

    }

 
    let img = json.data.result[0]; // Ambil satu gambar saja

    let caption = `✨ *Bing Image Generator*\n📌 *Prompt:* ${text}\n🔗 *Author:* Bot WhatsApp`;

 
    await conn.sendFile(m.chat, img, 'bingimg.jpg', caption, m);

  } catch (e) {

    console.error(e);

    m.reply('Terjadi kesalahan saat mengambil gambar.');

  }

};

 
handler.tags = ['ai'];

handler.help = ['bingimg <prompt>'];

handler.command = /^bingimg$/i;

 
export default handler;