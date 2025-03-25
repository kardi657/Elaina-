/*

# Fitur : yvideo
# Type : Plugins ESM
# Created by : https://whatsapp.com/channel/0029Vb2qri6JkK72MIrI8F1Z
# Api : p.oceansaver.in

   ⚠️ _Note_ ⚠️
jangan hapus wm ini banggg

*/

import axios from "axios";

const formatVideo = ["360", "480", "720", "1080"];

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

async function yvideo(url, quality = "720") {
  if (!formatVideo.includes(quality)) throw new Error("Resolusi tidak valid!");

  const config = {
    method: "GET",
    url: `https://p.oceansaver.in/ajax/download.php?format=${quality}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
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
    throw new Error("Gagal mengambil detail video.");
  }
}

let handler = async (m, { conn, text }) => {
  let [url, quality] = text.split(" ");
  if (!url) return m.reply("Masukkan link YouTube!");
  if (!quality) quality = "720";

  try {
    await global.loading(m, conn);
    let { title, image, downloadUrl } = await yvideo(url, quality);
    
    let caption = `🎥 *Judul:* ${title}\n📽️ *Resolusi:* ${quality}p\n🔗 *Link:* ${downloadUrl}`;
    
    await conn.sendMessage(m.chat, { image: { url: image }, caption }, { quoted: m });
    await conn.sendMessage(m.chat, { video: { url: downloadUrl }, mimetype: "video/mp4" }, { quoted: m });
  } catch (e) {
    m.reply("❌ Gagal mengambil video.");
  }
};

handler.help = ['ymp4 <link>'];
handler.command = ['ymp4'];
handler.tags = ['downloader'];
export default handler;