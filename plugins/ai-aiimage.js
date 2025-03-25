import axios from "axios";

async function generateImage(prompt) {
    try {
        const url = `https://1yjs1yldj7.execute-api.us-east-1.amazonaws.com/default/ai_image?prompt=${encodeURIComponent(prompt)}&aspect_ratio=1:1&link=writecream.com`;

        const headers = {
            "User-Agent":
                "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36",
            "Referer": "https://www.writecream.com/ai-image-generator-free-no-sign-up/",
        };

        const response = await axios.get(url, { headers });

        if (response.data && response.data.image_link) {
            return { success: true, imageUrl: response.data.image_link };
        } else {
            return { success: false, message: "Gagal mendapatkan gambar" };
        }
    } catch (error) {
        return {
            success: false,
            message: "Terjadi kesalahan",
            error: error.response ? error.response.data : error.message,
        };
    }
}

const handler = async (m, { conn, args }) => {
    if (!args.length) return m.reply(`promptnya om?\nEX: .aiimage A chibi anime girl with long yellow hair is completely naked, not wearing any clothes, has big breasts, wolf ears, and next to her is a sign that says "Anisa Cantik".`);

    await global.loading(m, conn);

    const prompt = args.join(" ");
    const result = await generateImage(prompt);

    if (result.success) {
        await conn.sendMessage(
            m.chat,
            { image: { url: result.imageUrl }, caption: `🖼️ *AI Image Generator*\n\n🎨 Prompt: ${prompt}` },
            { quoted: m }
        );
    } else {
        m.reply(`${result.message}`);
    }
};

handler.help = ["aiimage"];
handler.tags = ["ai"];
handler.command = ["aiimage"];
export default handler;