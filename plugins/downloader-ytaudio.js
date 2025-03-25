import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
    if (!text) return conn.reply(m.chat, 'Masukkan URL YouTube!', m);

    let apiUrl = `https://api.botcahx.eu.org/api/dowloader/yt?url=${encodeURIComponent(text)}&apikey=${btz}`;

    try {
        await global.loading(m, conn);
        let response = await fetch(apiUrl);
        let data = await response.json();

        if (data.status) {
            let { title, mp3, thumb, duration, id, description } = data.result;

            let caption = `🎵 *YTMP3*\n\n📌 *Judul:* ${title}\n⏳ *Durasi:* ${duration} detik\n🆔 *ID:* ${id}\n📝 Mohon maaf ya kalau error.....`;

           let img  = await conn.sendMessage(m.chat, { image: { url: thumb }, caption }, { quoted: m });

            await conn.sendMessage(m.chat, { 
                audio: { url: mp3 }, 
                mimetype: 'audio/mp4', 
                ptt: false 
            }, { quoted: img });

            
            
        } else {
            await conn.reply(m.chat, 'Gagal mengambil data.', m);
        }
    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, 'Mohon maaf ya audio nya gagal terkirim...', m);
    }
};

handler.help = ['ytmp3'];
handler.command = ['ytmp3'];
handler.tags = ['downloader'];
export default handler;