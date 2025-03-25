import axios from 'axios';

export async function before(m, { conn }) {
    conn.autosholat = conn.autosholat || {};
    conn.adz = conn.adz || {};

    let lokasi = 'lubuklinggau'; 

    for (let id in global.db.data.chats) {
        let chat = global.db.data.chats[id];
        if (!chat.notifazan) continue; 

        if (!(id in conn.autosholat)) {
            let jadwal = await jadwalsholat(lokasi);
            conn.autosholat[id] = { jadwal, interval: null };

            conn.autosholat[id].interval = setInterval(() => {
                const date = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
                const timeNow = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

                for (const [sholat, waktu] of Object.entries(conn.autosholat[id].jadwal)) {
                    if (timeNow === waktu && !conn.adz[id]) {
                        conn.adz[id] = true;

                        let url = sholat === "shubuh" 
                            ? "https://files.catbox.moe/dc79p5.opus" 
                            : "https://files.catbox.moe/dc79p5.opus";
                        
                        let thumbnail = (await conn.getFile("https://files.catbox.moe/v829ik.png")).data;

                        conn.sendMessage(id, {
                            audio: { url },
                            mimetype: 'audio/mpeg',
                            ptt: true,
                            contextInfo: {
                                externalAdReply: {
                                    showAdAttribution: true,
                                    mediaType: 1,
                                    title: `📢 Waktunya Sholat ${sholat.toUpperCase()}!`,
                                    body: `🕑 ${waktu} WIB`,
                                    thumbnail,
                                    renderLargerThumbnail: true
                                }
                            }
                        });

                        setTimeout(() => { delete conn.adz[id]; }, 60000);
                    }
                }
            }, 25000); 
        }
    }
}

async function jadwalsholat(kota) {
    try {
        const { data } = await axios.get(`https://api.aladhan.com/v1/timingsByCity?city=${kota}&country=Indonesia&method=8`);
        return {
            shubuh: data.data.timings.Fajr,
            dhuhur: data.data.timings.Dhuhr,
            ashar: data.data.timings.Asr,
            maghrib: data.data.timings.Maghrib,
            isya: data.data.timings.Isha
        };
    } catch (e) {
        console.error("Error mengambil jadwal sholat:", e);
        return null;
    }
}