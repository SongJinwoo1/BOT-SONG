const http = require('http');

// كود نبض الحياة لإبقاء السيرفر يعمل على Render
http.createServer((req, res) => {
  res.write('Song Jinwoo is Alive!');
  res.end();
}).listen(process.env.PORT || 3000);

const { 
    default: makeWASocket, 
    useMultiFileAuthState 
} = require('@whiskeysockets/baileys');
const pino = require('pino');
require('./config'); // التأكد من وجود ملف config.js في مستودعك

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState('session');
    
    const sock = makeWASocket({ 
        logger: pino({ level: 'silent' }), 
        auth: state, 
        printQRInTerminal: true 
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const command = msg.message.conversation || msg.message.extendedTextMessage?.text;

        if (command === '.start') {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: `⚔️ ARISE! \nأنا ${global.botName || 'Song Jinwoo'} في خدمتك.` 
            });
        }
    });

    console.log('✅ Bot is running...');
}

start();
