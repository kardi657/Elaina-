import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
    if (!text) return conn.reply(m.chat, 'Masukkan URL YouTube!', m);

    let apiUrl = `https://api.botcahx.eu.org/api/dowloader/yt?url=${encodeURIComponent(text)}&apikey=${btz}`;

    try {
        await global.loading(m, conn);
        let response = await fetch(apiUrl);
        let data = await response.json();

        if (data.status) {
            let { title, mp4, thumb, duration, id, description } = data.result;

            let caption = `🎬 *YTMP4*\n\n📌 *Judul:* ${title}\n⏳ *Durasi:* ${duration} detik\n🆔 *ID:* ${id}\n📝 Mohon maaf ya kalau error.....`;

            
            await conn.sendMessage(m.chat, { 
                video: { url: mp4 }, 
                caption 
            }, { quoted: m });

            
            
        } else {
            await conn.reply(m.chat, 'Gagal mengambil data.', m);
        }
    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, 'Mohon maaf ya video nya gagal terkirim...', m);
    }
};

handler.help = ['ytmp4'];
handler.command = ['ytmp4'];
handler.tags = ['downloader'];
export default handler;