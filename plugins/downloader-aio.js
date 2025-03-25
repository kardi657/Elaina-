//© Kayoko Chan ©2024-2025
// • Credits : wa.me/6285769668470 [ linoozy ]
// • Owner: 6285769668470

/*
• sumber scrape
- https://whatsapp.com/channel/0029VafnytH2kNFsEp5R8Q3n/208
*/

import axios from 'axios'
import cheerio from 'cheerio'
import FormData from 'form-data'

const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Referer": "https://getindevice.com/facebook-video-downloader/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"
}

/**
 * Mengambil token dari halaman downloader
 * @returns {Promise<String>}
 */
async function getToken() {
    let { data } = await axios.get('https://getindevice.com/facebook-video-downloader/', { headers })
    const $ = cheerio.load(data)
    return $('input#token').attr('value')
}

/**
 * Scraper AIO Video Downloader
 * @param {String} url 
 * @returns {Promise<Object>}
 */
async function aioDownloader(url) {
    let token = await getToken()
    let formData = new FormData()
    formData.append('url', url)
    formData.append('token', token)

    let { data } = await axios.post('https://getindevice.com/wp-json/aio-dl/video-data/', formData, { headers })
    return data
}

let handler = async (m, { conn, text }) => {
    if (!text) throw 'Masukkan URL video yang ingin diunduh!'

    try {
        await global.loading(m, conn);

        let result = await aioDownloader(text)
        if (!result || !result.medias || result.medias.length === 0) throw 'Video tidak ditemukan atau tidak dapat diunduh.'

        let caption = `🔗 *AIO Video Downloader*\n\n🎬 *Judul:* ${result.title || 'Tidak tersedia'}\n📡 *Sumber:* ${result.source || 'Tidak diketahui'}`
        let videoUrl = result.medias[0]?.url || null

        if (videoUrl) {
            await conn.sendMessage(m.chat, { video: { url: videoUrl }, caption }, { quoted: m })
        } else {
            throw 'Gagal mengambil video.'
        }
    } catch (error) {
        console.error(error)
        await conn.sendMessage(m.chat, { text: '🙃yahh eror kak maaf ya' }, { quoted: m })
    }
}

handler.help = ['aio']
handler.tags = ['downloader']
handler.command = /^aio$/i

export default handler