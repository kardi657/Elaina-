import OpenAI from "openai"
const openai = new OpenAI({
    apiKey: "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",
    baseURL: "https://integrate.api.nvidia.com/v1"
})
let handler = async (m, { conn, usedPrefix, command, text }) => {
    try {
        if (!conn.nvidia) conn.nvidia = {}
        if (!text) return m.reply(`Masukan text! \n\nContoh : \n${usedPrefix + command} siapa kamu`)
        await global.loading(m, conn)
        if (!(m.sender in conn.nvidia)) {
            conn.nvidia[m.sender] = {
                timeOut: setTimeout(() => {
                    delete conn.nvidia[m.sender]
                }, 600000),
                messages: []
            }
        } else {
            clearTimeout(conn.nvidia[m.sender].timeOut)
        }
        let nvidia = conn.nvidia[m.sender]

        const completion = await openai.chat.completions.create({
            model: "google/gemma-2-27b-it",
            messages: [...nvidia.messages, {
                role: 'user',
                content: text
            }],
            temperature: 0.2,
            top_p: 0.7,
            max_tokens: 1024,
            stream: true,
        })
        let response = ""
        for await (const chunk of completion) {
            response += chunk.choices[0]?.delta?.content || ''
        }
        await m.reply(response, false, false, { smlcap: false })
        nvidia.messages.push({
            role: 'user',
            content: text
        }, {
            role: 'assistant',
            content: response
        })
        nvidia.timeOut = setTimeout(() => {
            delete conn.nvidia[m.sender]
        }, 600000)
    } finally {
        await global.loading(m, conn, true)
    }
}
handler.help = ['nvidia', 'openai']
handler.tags = ['internet']
handler.command = /^(nvidia|openai|ai)$/i
handler.limit = true
handler.onlyprem = true
export default handler