import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

global.config = {
    /*============== INFO LINK ==============*/
    instagram: 'https://www.instagram.com/encos_thea233',
    github: 'https://github.com/kardi657',
    group: '-',
    website: 'https://encos.my.id',
    saluran: '-',

    /*============== PAYMENT ==============*/
    dana: '085183034194',
    ovo: '085183034194',
    gopay: '085280386272',
    pulsa: '085183034194',

    /*============== STAFF ==============*/
    owner: [
        ['16312176248', 'ncos', true]
    ],

    /*============= PAIRING =============*/
    pairingNumber: "628161444194",
    pairingAuth: true,

    /*============== API ==============*/
    APIs: {
        lol: 'https://api.lolhuman.xyz',
        rose: 'https://api.itsrose.rest',
        xzn: 'https://skizoasia.xyz',
        betabotz : 'https://api.betabotz.eu.org',
        btz : 'https://api.botcahx.eu.org',
    },

    APIKeys: {
        'https://api.lolhuman.xyz': 'ZenOfficial',
        'https://api.itsrose.rest': 'Rk-f5d4b183e7dd3dd0a44653678ba5107c',
        'https://skizoasia.xyz': 'zenOfficial',
        'https://api.betabotz.eu.org': 'ZenOfficial',
        'https://api.botcahx.eu.org':'Kodok123456',
    },

    /*============== TEXT ==============*/
    watermark: 'ELAINA - MultiDevice',
    author: 'ZENOFC',
    loading: 'Mohon ditunggu...',
    errorMsg: 'Error :)',

    stickpack: 'Made With',
    stickauth: 'ELAINA - MD Sewa? Chat : 08176016737',

    digi: {
        username: "",
        apikey: ""
    },

    OK: {
        ID: "",
        Pin: "",
        Pass: "",        
        Apikey: ""
    },
    
    taxRate: 0.05,
    taxMax: 2000
}

global.loading = (m, conn, back = false) => {
    if (!back) {
        return conn.sendReact(m.chat, "🍬", m.key)
    } else {
        return conn.sendReact(m.chat, "🍍", m.key)
    }
}

/*============== EMOJI ==============*/
global.rpg = {
    emoticon(string) {
        string = string.toLowerCase()
        let emot = {
            level: '📊',
            limit: '🎫',
            health: '❤️',
            exp: '✨',
            atm: '💳',
            money: '💰',
            bank: '🏦',
            potion: '🥤',
            diamond: '💎',
            common: '📦',
            uncommon: '🛍️',
            mythic: '🎁',
            legendary: '🗃️',
            superior: '💼',
            pet: '🔖',
            trash: '🗑',
            armor: '🥼',
            sword: '⚔️',
            pickaxe: '⛏️',
            fishingrod: '🎣',
            wood: '🪵',
            rock: '🪨',
            string: '🕸️',
            horse: '🐴',
            cat: '🐱',
            dog: '🐶',
            fox: '🦊',
            robo: '🤖',
            dragon: '🐉',
            lion: '🦁',
            rhinoceros: '🦏',
            centaur: '🦄',
            kyubi: '🦊',
            griffin: '🦅',
            phonix: '🔥',
            wolf: '🐺',
            petfood: '🍖',
            iron: '⛓️',
            gold: '🪙',
            emerald: '❇️',
            upgrader: '🧰',
            bibitanggur: '🌱',
            bibitjeruk: '🌿',
            bibitapel: '☘️',
            bibitmangga: '🍀',
            bibitpisang: '🌴',
            anggur: '🍇',
            jeruk: '🍊',
            apel: '🍎',
            mangga: '🥭',
            pisang: '🍌',
            botol: '🍾',
            kardus: '📦',
            kaleng: '🏮',
            plastik: '📜',
            gelas: '🧋',
            chip: '♋',
            umpan: '🪱',
            skata: '🧩',
            bitcoin: '☸️',
            polygon: '☪️',
            dogecoin: '☯️',
            etherium: '⚛️',
            solana: '✡️',
            memecoin: '☮️',
            donasi: '💸',
            ammn: '⚖️',
            bbca: '💵',
            bbni: '💴',
            cuan: '🧱',
            bbri: '💶',
            msti: '📡',
            steak: '🥩',
            ayam_goreng: '🍗',
            ribs: '🍖',
            roti: '🍞',
            udang_goreng: '🍤',
            bacon: '🥓',
            gandum: '🌾',
            minyak: '🥃',
            garam: '🧂',
            babi: '🐖',
            ayam: '🐓',
            sapi: '🐮',
            udang: '🦐'
        }
        if (typeof emot[string] !== 'undefined') {
            return emot[string]
        } else {
            return ''
        }
    }
}
// APIKEY INI WAJIB DI ISI! //

global.btc = 'Kodok123456' 

//Daftar terlebih dahulu https://api.botcahx.eu.org

// INI HANYA OPTIONAL SAJA BOLEH DI ISI BOLEH JUGA ENGGA //

global.btz = 'Kodok123456'

//Daftar https://api.betabotz.eu.org 

//Gausah diganti atau di ubah

global.APIs = {   

  btc: 'https://api.botcahx.eu.org'

}

//Gausah diganti atau di ubah

global.APIKeys = { 

  'https://api.botcahx.eu.org': global.btz

}
//------ JANGAN DIUBAH -----
let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
    unwatchFile(file)
    console.log(chalk.redBright("Update 'config.js'"))
    import(`${file}?update=${Date.now()}`)
})
