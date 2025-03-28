import { areJidsSameUser } from '@adiwajshing/baileys'
let handler = async (m, { conn, participants, isOwner, isAdmin }) => {
    if (!(isOwner || isAdmin)) return global.dfail('admin', m, conn)
    let users = m.mentionedJid.filter(u => !areJidsSameUser(u, conn.user.id))
    let promoteUser = []
    for (let user of users)
        if (user.endsWith('@s.whatsapp.net') && !(participants.find(v => areJidsSameUser(v.id, user)) || { admin: true }).admin) {
            const res = await conn.groupParticipantsUpdate(m.chat, [user], 'promote')
            await delay(1 * 1000)
        }
    m.reply('Succes')
}
handler.help = ['promote']
handler.tags = ['group']
handler.command = /^(promote)$/i

handler.group = true
handler.botAdmin = true

export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))