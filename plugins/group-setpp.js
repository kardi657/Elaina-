import { URL_REGEX } from '@adiwajshing/baileys'

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (/image/.test(mime)) {
        let img = await q.download()
        if (!img) return m.reply('Gambar tidak ditemukan')
        await conn.updateProfilePicture(m.chat, img)
    } else return m.reply(`kirim/balas gambar dengan caption *${usedPrefix + command}*`)
}
handler.help = ['setppgc']
handler.tags = ['group']
handler.command = /^setppgc$/i

handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler