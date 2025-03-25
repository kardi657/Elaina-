/*
 
# Fitur : Spotify Downloader
# Type : Plugins ESM
# Created by : https://whatsapp.com/channel/0029Vb2qri6JkK72MIrI8F1Z
# Screpe by : https://whatsapp.com/channel/0029VaylUlU77qVT3vDPjv11/1669
 
   ⚠️ _Note_ ⚠️
jangan hapus wm ini banggg
 
*/
 
import axios from 'axios';
 
async function spotidown(url) {
    try {
        await global.loading(m, conn);
        const response = await axios.post('https://spotymate.com/api/download-track',
            { url: url },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36',
                    'Referer': 'https://spotymate.com/'
                }
            }
        );
 
        if (response.data && response.data.file_url) {
            return response.data.file_url;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}
 
let handler = async (m, { conn, args }) => {
    if (!args[0]) return m.reply('❌ Masukkan link Spotify!');
 
    let url = args[0];
 
 
    m.reply('⏳ Tunggu bentar bang. . .');
 
    let result = await spotidown(url);
 
    if (!result) return m.reply('❌ Gagal mendapatkan audio!');
 
 
    await conn.sendMessage(m.chat, { audio: { url: result }, mimetype: 'audio/mpeg' }, { quoted: m });
};
 
handler.command = /^spotify(dl|down|download)$/i;
handler.tags = ['downloader'];
handler.help = ['spotify <link>'];
 
export default handler;