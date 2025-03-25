/*

# Fitur : TikTok Search (Random Video)
# Type : Plugins ESM
# Created by : https://whatsapp.com/channel/0029Vb2qri6JkK72MIrI8F1Z
# Api : https://api.siputzx.my.id

   ⚠️ _Note_ ⚠️
jangan hapus wm ini banggg

*/

import fetch from 'node-fetch';

let handler = async (m, { text, conn }) => {
    if (!text) return m.reply('❌ Masukkan query pencarian!');
    await global.loading(m, conn);
    
    try {
        let res = await fetch(`https://api.siputzx.my.id/api/s/tiktok?query=${encodeURIComponent(text)}`);
        let json = await res.json();

        if (!json.status || !json.data || json.data.length === 0) {
            return m.reply('❌ Error\nTidak ada hasil ditemukan!');
        }

        let randomVideo = json.data[Math.floor(Math.random() * json.data.length)];
        let videoUrl = `https://www.tiktok.com/@${randomVideo.author}/video/${randomVideo.video_id}`;
        let videoDownloadUrl = randomVideo.play; 

        let caption = `🎵 *TikTok Search Result* 🎵\n\n` +
                      `📌 *Title:* ${randomVideo.title}\n` +
                      `📍 *Region:* ${randomVideo.region}\n` +
                      `🔗 *Video Link:* ${videoUrl}`;

        await conn.sendMessage(m.chat, { video: { url: videoDownloadUrl }, caption }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply('❌ Error\nLogs error : ' + e.message);
    }
};

handler.tags = ['search'];
handler.help = ['ttsearch2 <query>'];
handler.command = ['ttsearch2'];

export default handler;