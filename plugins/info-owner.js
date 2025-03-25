let handler = async (m, { conn }) => {
    let ownerNumber = global.config.owner[0][0];
    let formattedNumber = formatNumber(ownerNumber); 

    let ownerText = `_Cari Owner?_\n
*Nama Owner : ZackDev*
*Kontak Owner : wa.me/${ownerNumber}*\n
Silakan pencet link kontak owner di atas.
_Jangan call dan spam owner yah, terima kasih._`;

    const img = await conn.sendMessage(m.chat, { 
        image: { url: 'https://files.catbox.moe/byvibs.jpg' }, 
        caption: ownerText 
    }, { quoted: m });

    await new Promise(resolve => setTimeout(resolve, 1000));

    let contact = {
        contacts: { 
            displayName: "ZackDev", 
            contacts: [{ vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:ZackDev\nTEL;waid=${ownerNumber}:${formattedNumber}\nEND:VCARD` }]
        }
    };
    await conn.sendMessage(m.chat, contact, { quoted: img });
}

handler.help = ['owner']
handler.tags = ['owner']
handler.command = /^(owner)$/i;

export default handler;

function formatNumber(number) {
    if (!number.startsWith('62')) number = '62' + number.replace(/^0+/, '');
    return `+${number.slice(0, 2)} ${number.slice(2, 5)}-${number.slice(5, 9)}-${number.slice(9)}`;
}