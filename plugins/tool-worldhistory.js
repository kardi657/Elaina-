/*
📌 Nama Fitur: World History
🏷️ Type : Plugin ESM
🔗 Sumber : https://whatsapp.com/channel/0029Vb91Rbi2phHGLOfyPd3N
🔗 Scrape: Makasih Reza Skrep Nya 🥰
✍️ Convert By ZenzXD
*/


import fetch from 'node-fetch'
import cheerio from 'cheerio'

const handler = async (m, { conn, usedPrefix, command }) => {
  try {
    const res = await fetch('https://www.worldhistory.org/trans/id/')
    const html = await res.text()
    const $ = cheerio.load(html)

    let hasil = []

    $('.ci_related_content_wrapper .content_item').each((i, el) => {
      const title = $(el).find('h3').text().trim()
      const link = 'https://www.worldhistory.org' + $(el).attr('href')
      const img = $(el).find('picture img').attr('src')
      const description = $(el).find('.ci_preview').text().trim()

      hasil.push({ title, link, img, description })
    })

    if (!hasil.length) return m.reply('❌ Tidak ada artikel yang ditemukan dari situs WorldHistory.')

    let teks = `🌍 *Artikel Terbaru dari WorldHistory.org*\n\n`
    hasil.slice(0, 10).forEach((item, i) => {
      teks += `*${i + 1}. ${item.title}*\n`
      teks += `📝 ${item.description}\n`
      teks += `🔗 ${item.link}\n\n`
    })

    const thumb = hasil[0]?.img || 'https://www.worldhistory.org/images/logos/logo-main.png'

    await conn.sendMessage(m.chat, {
      image: { url: thumb },
      caption: teks.trim(),
      footer: 'Sumber: https://www.worldhistory.org',
      buttons: [
        { buttonId: `${usedPrefix + command}`, buttonText: { displayText: '🔄 Muat Ulang' }, type: 1 },
        { buttonId: 'https://www.worldhistory.org/trans/id/', buttonText: { displayText: '🌐 Kunjungi Situs' }, type: 1 }
      ],
      headerType: 4
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('⚠️ Terjadi kesalahan saat mengambil data dari worldhistory.org.')
  }
}

handler.command = ['worldhistory']
handler.help = ['worldhistory']
handler.tags = ['Tools']
handler.limit = false

export default handler