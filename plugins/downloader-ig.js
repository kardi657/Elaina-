/*
- PLUGINS IG
- Scrape by: ZErvida
- Soure: https://whatsapp.com/channel/0029VakezCJDp2Q68C61RH2C
*/
import axios from 'axios';
import cheerio from 'cheerio';
import FormData from 'form-data';

const snapinst = {
    async app(url) {
       const { data } = await axios.get('https://snapinst.app/');
       const $ = cheerio.load(data);
       const form = new FormData();
    
       form.append('url', url);
       form.append('action', 'post');
       form.append('lang', '');
       form.append('cf-turnstile-response', '');
       form.append('token', $('input[name=token]').attr('value'));
    
       const headers = {
         ...form.getHeaders(),
         'accept': '*/*',
         'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
         'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
         'sec-ch-ua-mobile': '?1',
         'sec-ch-ua-platform': '"Android"',
         'sec-fetch-dest': 'empty',
         'sec-fetch-mode': 'cors',
         'sec-fetch-site': 'same-origin',
         'Referer': 'https://snapinst.app/',
         'Referrer-Policy': 'strict-origin-when-cross-origin'
       };
    
       const jsbejad = await axios.post('https://snapinst.app/action2.php', form, { headers });
       const ayok = new Function('callbuk', jsbejad.data.replace('eval', 'callbuk'));
       
       const html = await new Promise((resolve, reject) => {
           ayok(t=>{
             const code = t.split(".innerHTML = ")[1].split("; document.")[0];
             resolve(eval(code));
           });
       });
       
       const _ = cheerio.load(html);
       const res = {
           urls: []
       };
       _('.row .download-item').each((i, e)=>{
           res.urls.push(_(e).find('.download-bottom a').attr('href'));
       });
       
       return res;
    },
};

let handler = async (m, { conn, text, command, usedPrefix }) => {
    if (!text) throw `EX: ${usedPrefix}${command} https://instagram.com/xxxxxx`;
    
    await global.loading(m, conn);

    try {
        const result = await snapinst.app(text);

        if (!result.urls.length) throw 'Gagal mendapatkan link unduhan. Coba lagi nanti.';

        for (let url of result.urls) {
            await conn.sendMessage(m.chat, { video: { url }, caption: `Request By ${m.pushName}` });
        }

    } catch (error) {
        m.reply(`Terjadi kesalahan: ${error.message}`);
    }
};

handler.help = ['instagram'].map(v => v + ' <url>');
handler.tags = ['downloader'];
handler.command = /^(instagram|ig|igdl)$/i;
handler.limit = true;
export default handler;