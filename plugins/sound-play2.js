import axios from 'axios';
import fs from 'fs-extra';
import ffmpeg from 'fluent-ffmpeg';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw (`Contoh: ${usedPrefix + command} dj aku meriang`);
    await global.loading(m, conn);
    const apiUrl = 'https://api.fanzoffc.eu.org/api/play2/';
    const apiKey = 'FanzOffc';
    const maxAttempts = 20;
    let response = null;

    let attempt = 0;
    while (attempt < maxAttempts) {
        try {
            attempt++;

            response = await axios.get(apiUrl, {
                params: {
                    query: text,
                    apikey: apiKey,
                },
            });

            if (response.data && response.data.status) {
                break;
            } else {
                throw new Error('Respon API tidak valid');
            }
        } catch (error) {
            if (attempt === maxAttempts) {
                console.error('Kesalahan setelah percobaan maksimal:', error.message);
                throw `Gagal mendapatkan data setelah ${maxAttempts} percobaan.`;
            }
            console.log(`Percobaan ${attempt} gagal: ${error.message}. Mencoba lagi...`);
        }
    }

    try {
        let { title, duration, thumbnail, data } = response.data;

        let caption = `*∘ Judul :* ${title}\n`;
        caption += `*∘ Durasi :* ${duration}\n`;

        await conn.relayMessage(m.chat, {
            extendedTextMessage: {
                text: caption,
                contextInfo: {
                    externalAdReply: {
                        title: title,
                        body: 'Klik untuk melihat detail',
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true,
                        thumbnailUrl: thumbnail,
                        sourceUrl: thumbnail,
                    },
                },
            },
        }, {});

        const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, '_');
        const videoPath = `./tmp/${sanitizedTitle}.mp4`;
        const audioPath = `./tmp/${sanitizedTitle}.mp3`;

        const videoResponse = await axios({
            url: data.mp4.link,
            method: 'GET',
            responseType: 'stream',
        });

        const writer = fs.createWriteStream(videoPath);
        videoResponse.data.pipe(writer);
        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        ffmpeg(videoPath)
            .inputOption('-vn')
            .outputOption('-acodec', 'libmp3lame')
            .outputOption('-preset', 'ultrafast')
            .outputOption('-b:a', '128k')
            .saveToFile(audioPath)
            .on('error', (err) => {
                console.error("Kesalahan saat konversi:", err.message);
                throw 'Gagal mengonversi video ke audio.';
            })
            .on('end', async () => {
                let audioBuffer = fs.readFileSync(audioPath);
                await conn.sendMessage(
                    m.chat,
                    { mimetype: "audio/mpeg", audio: audioBuffer },
                    { quoted: m }
                );

                fs.unlinkSync(videoPath);
                fs.unlinkSync(audioPath);
            });

    } catch (error) {
        console.error("Error:", error.message);
        throw `Terjadi kesalahan saat memproses permintaan. Coba lagi nanti.\nError: ${error.message}`;
    }
};

handler.command = handler.help = ['ply'];
handler.tags = ['sound'];

export default handler;