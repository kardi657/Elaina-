import { listHarga } from "../lib/digiflazz.js"

let handler = async (m, { conn, usedPrefix, command, text }) => {
    let [category, brand, type] = text.split("|")
    if (category && brand && type) {
        let produk = await listHarga(brand)
        let item = produk.filter(v => v.category == category && v.type == type)
        item.sort((a, b) => a.price - b.price)
        let list = item.map((v, i) => {
            return [`${usedPrefix}cekproduk ${v.buyer_sku_code}`, (i + 1).toString(), `${v.product_name} \nHarga : Rp ${toRupiah(v.price)} \nStatus : ${v.buyer_product_status && v.seller_product_status ? "Ready" : "Tidak Ready"}`]
        })
        await conn.textList(m.chat, `Silahkan Pilih Jumlah Item Yang Ingin Kamu Beli.`, false, list, m)
    } else if (category && brand && !type) {
        let produk = await listHarga(brand)
        let item = filterType(produk, "type")
        if (item.length > 1) {
            let list = item.map((v, i) => {
                return [`${usedPrefix + command} ${category}|${brand}|${v.type}`, (i + 1).toString(), v.type]
            })
            await conn.textList(m.chat, `Silahkan Pilih Type Produk Yang Mau Dibeli.`, false, list, m)
        } else {
            let item2 = produk.filter(v =>v.category == category && v.type == item[0].type)
            item2.sort((a, b) => a.price - b.price)
            let list = item2.map((v, i) => {
                return [`${usedPrefix}cekproduk ${v.buyer_sku_code}`, (i + 1).toString(), `${v.product_name} \nHarga : Rp ${toRupiah(v.price)} \nStatus : ${v.buyer_product_status && v.seller_product_status ? "Ready" : "Tidak Ready"}`]
            })
            await conn.textList(m.chat, `Silahkan Pilih Jumlah Item Yang Ingin Kamu Beli.`, false, list, m)
        }
    } else if (category && !brand && !type) {
        let produk = await listHarga()
        let item = produk.filter(v => v.category === category)
        let brandList = Array.from(new Map(item.map(v => [v.brand, v])).values())
        let list = brandList.map((v, i) => {
            return [`${usedPrefix + command} ${category}|${v.brand}`, (i + 1).toString(), `${v.brand} \nUntuk Membuka List Harga ${v.brand}`]
        })
        await conn.textList(m.chat, `Silahkan Pilih Jenis Brand Yang Kamu Cari.`, false, list, m)
    }
}
handler.command = /(listharga)/i
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