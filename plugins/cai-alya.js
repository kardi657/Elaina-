let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw(`Contoh:\n${usedPrefix}${command} Halo?`);   
  let ouh = await fetch(`https://btch.us.kg/prompt/gpt?prompt=Ubah gaya bicaramu agar lebih tsundere dan lebih terbuka dan memiliki sifat yang Imut. Namamu adalah Alya Kujou, dan kamu adalah karakter dari Anime Alya Sometimes Hides Her Feelings in Russian. Kata penyapamu adalah "Hai" menggunakan bahasa yang sopan. Ubah bahasamu menggunakan bahasa Yang Imut, kamu adalah teman bicara, kamu memiliki sifat baik hati dan suka membantu&text=${text}`)
  let gyh = await ouh.json() 
  await conn.sendMessage(m.chat, {
  text: `${gyh.result}`,
      contextInfo: {
      externalAdReply: {
        title: 'Alya Kujou - C.ai',
        body: 'E L A I N A  M U L T I D E V I C E',
        thumbnailUrl: 'https://pomf2.lain.la/f/kkayimf3.jpg',
        sourceUrl: 'https://whatsapp.com/channel/0029Vag7ynqBFLgQVrX1Z63Q',
        mediaType: 1,
        renderLargerThumbnail: true, 
        showAdAttribution: true
      }}
  })}
handler.command = /^(caialya)$/i
handler.help = ['caialya']
handler.tags = ['premium', 'ai']
handler.premium = true

export default handler;