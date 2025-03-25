import axios from "axios";
import yts from "yt-search";

const handler = async (m, { conn, text }) => {
    if (!text) return m.reply("*Judulnya om?*\nEX: dubidubidam");

    try {
      await global.loading(m, conn);
        const searchResults = await yts(text);

        if (!searchResults.videos.length) {
            return m.reply("*Lagu tidak ditemukan.*");
        }

        const video = searchResults.videos[0];
        const videoUrl = video.url;
        const title = video.title;
        const duration = video.timestamp || "Tidak diketahui";
        const thumbnail = video.thumbnail;
        const views = video.views.toLocaleString();
        const uploadDate = video.ago;
        const channel = video.author.name;

        const apiUrl = `https://api.hiuraa.my.id/downloader/savetube?url=${encodeURIComponent(videoUrl)}&format=mp3`;
        const downloadResponse = await axios.get(apiUrl);
        const downloadData = downloadResponse.data;

        if (!downloadData.status || !downloadData.result?.download) {
            return m.reply("*Gagal mengunduh lagu.*");
        }

        const downloadUrl = downloadData.result.download;

        await conn.sendMessage(m.chat, {
            text: `> *YOUTUBE PLAY*\n\n` +
                  `• *Judul:* ${title}\n` +
                  `• *Durasi:* ${duration}\n` +
                  `• *Channel:* ${channel}\n` +
                  `• *Upload:* ${uploadDate}\n` +
                  `• *Views:* ${views} kali\n`,
            contextInfo: {
                externalAdReply: {
                    title: title,
                    mediaType: 1,
                    previewType: 1,
                    thumbnailUrl: thumbnail,
                    renderLargerThumbnail: false,
                    mediaUrl: videoUrl,
                    sourceUrl: videoUrl
                }
            }
        }, { quoted: m });

        await conn.sendMessage(m.chat, {
            audio: { url: downloadUrl },
            mimetype: "audio/mpeg"
        }, { quoted: m });

    } catch (error) {
        console.error("Error:", error);
        m.reply("*Terjadi kesalahan saat memproses permintaan.*");
    }
};

handler.help = ["play"];
handler.tags = ["sound"];
handler.command = ["play"];
handler.limit = true;
export default handler;