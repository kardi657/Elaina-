let handler = async (m, { conn,setReply }) => {
  if (!m.quoted) throw "repy pesan saluran";
  try {
    let id = (await m.getQuotedObj()).msg.contextInfo.forwardedNewsletterMessageInfo
      ;
    let teks = "Channel Name:" + " `" + `${id.newsletterName}` + "`\n";
    teks += "Channel Id:" + " `" + `${id.newsletterJid}` + "`";
    await conn.reply(m.chat, teks.trim(), m);
  } catch (e) {
    console.log(e);
    throw "Harus chat dari channel";
  }
};
handler.help = ['cid']
handler.tags = ['tool']
handler.command = /^cid$/i

handler.limit = true

export default handler