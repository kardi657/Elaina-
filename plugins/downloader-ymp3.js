/*

# Fitur : ymp3
# Type : Plugins ESM
# Created by : https://whatsapp.com/channel/0029Vb2qri6JkK72MIrI8F1Z
# Api : p.oceansaver.in

   ⚠️ _Note_ ⚠️
jangan hapus wm ini banggg

*/

import axios from "axios";

const formatAudio = ["mp3", "m4a", "webm", "aac", "flac", "opus", "ogg", "wav"];

async function cekProgress(id) {
  const config = {
    method: "GET",
    url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
  };

  while (true) {
    const response = await axios.request(config);
    if (response.data?.success && response.data.progress === 1000) {
      return response.data.download_url;
    }
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

async function ymp3(url) {
  const format = "mp3";

  const config = {
    method: "GET",
    url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
  };

  const response = await axios.request(config);
  if (response.data?.success) {
    const { id, title, info: { image } } = response.data;
    const downloadUrl = await cekProgress(id);

    return { title, image, downloadUrl };
  } else {
    throw new Error("Gagal mengambil detail audio.");
  }
}

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("Masukkan link YouTube!");

  try {
    await global.loading(m, conn);
    let { title, image, downloadUrl } = await ymp3(text);
    
    let caption = `🎵 *Judul:* ${title}\n🔗 *Link:* ${downloadUrl}`;
    
    await conn.sendMessage(m.chat, { image: { url: image }, caption }, { quoted: m });
    await conn.sendMessage(m.chat, { audio: { url: downloadUrl }, mimetype: "audio/mpeg" }, { quoted: m });
  } catch (e) {
    m.reply("❌ Gagal mengambil audio.");
  }
};

handler.help = ['ymp3 <link>'];
handler.command = ['ymp3'];
handler.tags = ['downloader'];
export default handler;