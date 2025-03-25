/*
 
# Fitur : Cek Cuaca
# Type : Plugins ESM
# Created by : https://whatsapp.com/channel/0029Vb2qri6JkK72MIrI8F1Z
# Api : https://api.diioffc.web.id/api/tools/cekcuaca?query=
 
   ⚠️ _Note_ ⚠️
jangan hapus wm ini banggg
 
*/
 
import fetch from 'node-fetch';
 
let handler = async (m, { args }) => {
  let query = args.join(" ");
  if (!query) return m.reply("Masukkan nama kota!\nContoh: .cuaca Jakarta");
 
  try {
    let res = await fetch(`https://api.diioffc.web.id/api/tools/cekcuaca?query=${encodeURIComponent(query)}`);
    let json = await res.json();
 
    if (!json.status) return m.reply("Gagal mengambil data cuaca!");
 
    let { name, main, weather, wind, sys } = json.result;
    let teks = `☁️ *Prakiraan Cuaca* ☁️
📍 Kota: *${name}*
🌡️ Suhu: *${main.temp}°C* (Terasa seperti ${main.feels_like}°C)
🌬️ Angin: *${wind.speed} m/s* dari arah ${wind.deg}°
💦 Kelembaban: *${main.humidity}%*
🌤️ Cuaca: *${weather[0].description}*
🌅 Matahari Terbit: *${new Date(sys.sunrise * 1000).toLocaleTimeString()}*
🌇 Matahari Terbenam: *${new Date(sys.sunset * 1000).toLocaleTimeString()}*`;
 
    m.reply(teks);
  } catch (e) {
    console.error(e);
    m.reply("Terjadi kesalahan saat mengambil data cuaca.");
  }
};
 
handler.tags = ["tools"];
handler.help = ["cuaca <kota>"];
handler.command = /^cuaca$/i;
 
export default handler;