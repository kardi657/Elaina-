/*

# Fitur : Auto buka tutup group saat waktu sholat
# Type : plugins esm
# Code by : https://whatsapp.com/channel/0029Vb2qri6JkK72MIrI8F1Z
# Terinspirasi dari : script menhera by RangelOfficial


    ⚠️ _NOTE_ ⚠️
 jangan bully code ku plss, kalo jelek ya maap baru belajar beberaoa bulan lalu soalnya

*/

import fetch from "node-fetch"
export async function before(m) {
    this.autosholat = this.autosholat ? this.autosholat : {}
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? this.user.jid : m.sender
    let id = m.chat
    if (id in this.autosholat) {
        return false
    }
    //let data = await (await fetch("https://api.aladhan.com/v1/timingsByCity?city=Cilegon&country=Indonesia&method=8")).json();
    //let jadwalSholat = data.data.timings;
    let jadwalSholat = {
     Shubuh: "04:42",
     Dzuhur: "12:03",
     Ashar: "15:14",
     Maghrib: "18:08",
     Isya: "19:14"
    }
    const date = new Date((new Date).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta"
    }));
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const timeNow = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    for (const [sholat, waktu] of Object.entries(jadwalSholat)) {
        if (timeNow === waktu) {
            let caption = `🔒 *ɢʀᴏᴜᴘ ᴀᴋᴀɴ ᴅɪ ᴛᴜᴛᴜᴘ sᴇʟᴀᴍᴀ 10 ᴍᴇɴɪᴛ ᴋᴀʀɴᴀ ᴡᴀᴋᴛᴜ sʜᴏʟᴀᴛ ${sholat} ᴛᴇʟᴀʜ ᴛɪʙᴀ, ᴀᴍʙɪʟ ᴀɪʀ ᴡᴜᴅʜᴜ ᴍᴜ ᴅᴀɴ ᴅᴇᴋᴀᴛᴋᴀɴ ᴅɪʀɪ ᴋᴇᴘᴀᴅᴀ ᴛᴜʜᴀɴ ʏᴀɴɢ ᴍᴀʜᴀ ᴇsᴀ.*`
            
            
            let imageUrl = 'https://files.catbox.moe/mk3aur.jpg'; // ganti pake gambat mu
            
            
            await this.groupSettingUpdate(m.chat, 'announcement'); 
            
            this.autosholat[id] = [
                
                this.sendMessage(m.chat, {
                    image: { url: imageUrl }, 
                    caption: caption, 
                    contextInfo: {
                        mentionedJid: [who]
                    }
                }),
                setTimeout(async () => {
                    
                    await this.groupSettingUpdate(m.chat, 'not_announcement'); 
                    this.reply(m.chat, "🔓 *ɢʀᴏᴜᴘ ᴛᴇʟᴀʜ ᴅɪ ʙᴜᴋᴀ, ᴀʏᴏ ʟᴀᴋᴜᴋᴀɴ ᴀᴋᴛɪғɪᴛᴀs ʟᴀɢɪ sᴇᴘᴇʀᴛɪ ʙɪᴀsᴀɴʏᴀ.*", null); 
                    delete this.autosholat[id];
                }, 600000) 
            ]
        }
    }
}
export const disabled = false