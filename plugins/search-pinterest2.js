import axios from 'axios';
const { generateWAMessageContent, generateWAMessageFromContent, proto } = (await import('@adiwajshing/baileys')).default;

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`• *Example:* ${usedPrefix + command} kucing`);

try {
  async function createImage(url) {
    const { imageMessage } = await generateWAMessageContent({
      image: { url }
    }, {
      upload: conn.waUploadToServer
    });
    return imageMessage;
  }
await global.loading(m, conn)
  let push = [];
  let { data } = await axios.get(`https://api.botcahx.eu.org/api/search/pinterest?text1=${text}&apikey=${btz}`)

  let ult = data.result.splice(0, 5);
  let i = 1;

  for (let lucuy of ult) {
    push.push({
      body: proto.Message.InteractiveMessage.Body.fromObject({
        text: `Image ke - ${i++}`
      }),
      footer: proto.Message.InteractiveMessage.Footer.fromObject({
        text: '*_ELAINA - MD_*' // Sesuaikan dengan watermark Anda
      }),
      header: proto.Message.InteractiveMessage.Header.fromObject({
        title: 'Hasil.',
        hasMediaAttachment: true,
        imageMessage: await createImage(lucuy)
      }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
        buttons: [
          {
            "name": "cta_url",
            "buttonParamsJson": `{"display_text":"Source","url":"https://www.pinterest.com/search/pins/?rs=typed&q=${text}","merchant_url":"https://www.pinterest.com/search/pins/?rs=typed&q=${text}"}`
          }
        ]
      })
    });
  }

  const bot = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
          body: proto.Message.InteractiveMessage.Body.create({
            text: "selesai..."
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: '*_ELAINA - MD_*' // Sesuaikan dengan watermark Anda
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            hasMediaAttachment: false
          }),
          carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
            cards: [...push]
          })
        })
      }
    }
  }, {});

  await conn.relayMessage(m.chat, bot.message, { messageId: bot.key.id });
} catch (e) {
throw e
} finally {
        await global.loading(m, conn, true)
}

}

handler.help = ["pinterest2"]
handler.tags = ["search"]
handler.command = /^(pin2|pinterest2)$/i
handler.limit = true
handler.onlyprem = true

export default handler;