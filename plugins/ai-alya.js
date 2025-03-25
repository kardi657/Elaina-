import axios from "axios";

let handler = async (m, { conn, text }) => {
  if (!text) throw `*• Example:* .aialya *[on/off]*`;

  if (text === "on") {
    conn.alyatsundere = conn.alyatsundere || {};
    conn.alyatsundere[m.sender] = true;
    m.reply("[ ✓ ] Success create session chat");
  } else if (text === "off") {
    if (conn.alyatsundere && conn.alyatsundere[m.sender]) {
      delete conn.alyatsundere[m.sender];
      m.reply("[ ✓ ] Success delete session chat");
    }
  }
};

handler.before = async (m, { conn }) => {
  conn.alyatsundere = conn.alyatsundere || {};

  
  if (!m.text || !conn.alyatsundere[m.sender]) return;
  
    if (m.isBaileys && m.fromMe) return;
    if (!m.text || !conn.alyatsundere[m.sender]) return;

  if (
    m.text.startsWith(".") ||
    m.text.startsWith("#") ||
    m.text.startsWith("!") ||
    m.text.startsWith("/") ||
    m.text.startsWith("\\/")
  ) return;

  try {
    const response = await fetch(`https://btch.us.kg/prompt/gpt?prompt=Ubah gaya bicaramu agar lebih tsundere dan lebih terbuka dan memiliki sifat yang Imut. Namamu adalah Alya Kujou, dan kamu adalah karakter dari Anime Alya Sometimes Hides Her Feelings in Russian. Kata penyapamu adalah "Hai" menggunakan bahasa yang sopan. Ubah bahasamu menggunakan bahasa Yang Imut, kamu adalah teman bicara, kamu memiliki sifat baik hati dan suka membantu&text=${encodeURIComponent(m.text)}`);
    
    const data = await response.json();
    await conn.sendMessage(m.chat, {text: `${data.result}`,
      contextInfo: {
      externalAdReply: {
        title: 'Alya Kujou C.ai',
        body: 'E L A I N A  M U L T I D E V I C E',
        thumbnailUrl: 'https://pomf2.lain.la/f/9byio5oj.jpg',
        sourceUrl: 'https://whatsapp.com/channel/0029Vag7ynqBFLgQVrX1Z63Q',
        mediaType: 1,
        renderLargerThumbnail: true, 
        showAdAttribution: true
      }
    }
  }, {quoted: m})
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

handler.command = ['aialya'];
handler.tags = ["ai", "premium"];
handler.help = ['aialya'].map(a => a + " *[on/off]*");
handler.premium = true

export default handler