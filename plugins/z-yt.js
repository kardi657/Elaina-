import axios from "axios";
import yts from "yt-search";

const sentMessages = new Set();
//const formatAudio = ["mp3", "m4a", "webm", "aac", "flac", "opus", "ogg", "wav"];
//const formatVideo = ["360", "480", "720", "1080", "1440", "4k"];
const formatAudio = ["mp3"];
const formatVideo = ["720"];

async function cekProgress(id) {
    const config = {
        method: "GET",
        url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/91.0.4472.124 Safari/537.36"
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

async function ytdl(url, format) {
    const config = {
        method: "GET",
        url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/91.0.4472.124 Safari/537.36"
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

async function searchYouTube(query) {
    const searchResults = await yts(query);
    if (!searchResults.videos.length) throw new Error("Video tidak ditemukan.");
    
    return searchResults.videos[0];
}

const handler = async (m, { conn, text, command }) => {
    if (!text) return m.reply("Judul/linknya om?\n\nEX:\n`.yt somebody's pleasure`\n`.yt https://youtu.be/xxxxxxx`");
    
    await global.loading(m, conn);

    if (sentMessages.has(m.key.id)) return;
    sentMessages.add(m.key.id);

    let videoUrl = text;
    let format = ["ytmp3", "yta"].includes(command) ? "mp3" : "720";
    let videoDetails = null;

    if (!text.includes("youtu")) {
        try {
            videoDetails = await searchYouTube(text);
            videoUrl = videoDetails.url;
        } catch (error) {
            return m.reply("Gagal mencari video. Coba judul lain.");
        }
    }

    try {
        const result = await ytdl(videoUrl, format);
        if (!result.downloadUrl) return m.reply("Gagal mengunduh media.");

        const { title, image, downloadUrl } = result;
        
        const details = videoDetails || { title, url: videoUrl, timestamp: "Tidak diketahui", views: "Tidak diketahui", ago: "Tidak diketahui", author: { name: "Tidak diketahui" } };

        await conn.sendMessage(
            m.chat,
            {
                text: `╭── 「 YOUTUBE ${format.toUpperCase()} 」\n` +
                      `│  • Judul: *${details.title}*\n` +
                      `│  • Durasi: *${details.timestamp}*\n` +
                      `│  • Views: *${details.views}*\n` +
                      `│  • Upload: *${details.ago}*\n` +
                      `│  • Channel: *${details.author.name}*\n` +
                      "╰───────────────",
                contextInfo: {
                    externalAdReply: {
                        title: details.title,
                        thumbnailUrl: image,
                        sourceUrl: details.url,
                        mediaType: 1,
                    },
                },
            },
            { quoted: m }
        );

        const mediaType = format === "mp3" ? "audio" : "video";
        const mimeType = format === "mp3" ? "audio/mpeg" : "video/mp4";

        await conn.sendMessage(
            m.chat,
            {
                [mediaType]: { url: downloadUrl },
                mimetype: mimeType,
            },
            { quoted: m }
        );
    } catch (error) {
        m.reply(`Terjadi kesalahan:\n${error.message}`);
    }

    setTimeout(() => sentMessages.delete(m.key.id), 30000);
};

handler.help = ['yt'].map(v => v + ' <url>');
handler.tags = ["search"];
handler.command = ['yt', 'youtube'];
handler.limit = 3;
export default handler;