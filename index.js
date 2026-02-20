const http = require('http');
http.createServer((req, res) => res.end('Song Jinwoo is Alive!')).listen(process.env.PORT || 3000);
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const pino = require('pino')
require('./config')

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState('session')
    const sock = makeWASocket({ logger: pino({ level: 'silent' }), auth: state, printQRInTerminal: true })
    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0]
        if (!msg.message || msg.key.fromMe) return
        if (msg.message.conversation === '.start') {
            await sock.sendMessage(msg.key.remoteJid, { text: ⚔️ ARISE! \nأنا ${global.botName} في خدمتك. })
        }
    })
    console.log('✅ Bot is running...')
}
start()
