import { listHarga } from "../lib/digiflazz.js"

let handler = async (m, { conn, usedPrefix, command, text }) => {
    let user = global.db.data.users[m.sender]
    let name = user.registered ? user.name : m.name
    let produk = await listHarga()
    let item = filterType(produk, "category")
    let menuTopup = item.map(v => {
        return {
            "header": "",
            "title": v.category,
            "description": `Untuk Memilih Jenis ${v.category}`,
            "id": `${usedPrefix}listHarga ${v.category}`
        }
    })
    let button = [{
        "name": "single_select",
        "buttonParamsJson": JSON.stringify({
            "title": "Click Here",
            "sections": [{
                "title": "Topup Menu",
                "highlight_label": "",
                "rows": menuTopup
            }]
        })
    }]
    let caption = `
*INFO USER*
Nama : *${name}*
Rank : *${user.rank}*
Saldo : *Rp ${toRupiah(user.deposit)}*

_Silahkan Pilih Produk Dibawah Ini, Tersedia Berbagai Macam Kebutuhan Dan Yang Pasti Murah!_
`.trim()
    await conn.sendButton(m.chat, caption, global.config.watermark, false, button, m)
}
handler.help = ["topup"]
handler.tags = ["topup"]
handler.command = /(topup(menu)?)/i
export default handler

function toRupiah(number) {
    return new Intl.NumberFormat('id-ID').format(number)
}

const filterType = (data, idKey) => {
    const seen = new Set()
    return data.filter(item => {
        if (item[idKey]) {
            if (seen.has(item[idKey])) {
                return false
            }
            seen.add(item[idKey])
        }
        return true
    })
}