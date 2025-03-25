/*
Jangan delete bang 

* Search group 
* Type Esm
* Sesuaikan dengan database mu
* Saluran : https://whatsapp.com/channel/0029VavBc6uHAdNdbgCgOK0k */

import cheerio from 'cheerio'
import axios from 'axios'

let handler = async (m, {
    text,
    usedPrefix,
    command
}) => {

    if (!text) return m.reply(`Example : ${usedPrefix + command} <query>`)
    await m.reply('Tunggu bentar, sedang mencari query...')
    if (/link/i.test(command)) {
        let link = await groupsor.link(text)
        await m.reply(link)
    } else {
        let data = await groupsor.search(text)
        if (data.length == 0) return m.reply(`Tidak dapat menemukan group ${text}`)

        let cap = `Terdapat ${data.length} Group silahkan pilih mana group yang anda cari\n`
        data.forEach((v, index) => {
            cap += `\n*Name:* ${v.title}\n- *Desk:* ${v.desc.length >= 49 ? `${v.desc}..` : v.desc}\n- *Link:* ${v.link}\n`
        })
        await conn.reply(m.chat, cap, m)
    }
}

handler.help = ['gcwa']
handler.tags = ['search']
handler.command = /^((group(wa)?|gcwa)(-link)?)$/i
handler.limit = true

export default handler

let groupsor = {
    search: async (query) => {
        return new Promise(async (resolve, reject) => {
            try {
                let baseurl = 'https://groupsor.link'
                let {
                    data
                } = await axios.get(`${baseurl}/group/searchmore/${query}`)
                let $ = cheerio.load(data)
                let result = []
                $("body > .maindiv").each(function (a, b) {
                    let title = $(b).find("a > span").text()
                    let desc = $(b).find(".post-basic-info > p").text().slice(0, 50)
                    let link = $(b).find("div.post-info-rate-share > span.joinbtn > a.joinbtn").attr("href")
                    result.push({
                        title,
                        desc,
                        link
                    })
                })
                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    },
    link: async (url) => {
        return new Promise(async (resolve, reject) => {
            try {
                let {
                    data
                } = await axios.get(url)
                let $ = cheerio.load(data)
                let link = $(".formdl > center > div > b > a").attr("href")
                resolve(link)
            } catch (error) {
                reject(error)
            }
        })
    }
}