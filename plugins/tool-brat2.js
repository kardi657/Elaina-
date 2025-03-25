import {
    Sticker
} from 'wa-sticker-formatter';
import fetch from 'node-fetch'

let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    if (m.quoted && m.quoted.text) {
        text = m.quoted.text || 'hai'
    } else if (text) {
        text = text
    } else if (!text && !m.quoted) return m.reply('reply / masukan teks');

    try {
        
        await global.loading(m, conn);
        const response = `https://brat.caliphdev.com/api/brat?text=${encodeURIComponent(text)}`
        
        let stiker = await createSticker(false, response, 'ELAINA - MD', 10)
        if (stiker) await conn.sendFile(m.chat, stiker, '', '', m)
    } catch (e) {
        throw e
    }
}

handler.help = ['brat2']
handler.tags = ['tools']
handler.command = /^(brat2)$/i
handler.limit = true
handler.onlyprem = true

export default handler

async function createSticker(img, url, packName, authorName, quality) {
    let stickerMetadata = {
        type: 'crop',
        pack: packName,
        author: authorName,
        quality
    }
    return (new Sticker(img ? img : url, stickerMetadata)).toBuffer()
}