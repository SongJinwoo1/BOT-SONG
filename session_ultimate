const http = require('http');
http.createServer((req, res) => { res.write('Jinwoo Bot is Alive!'); res.end(); }).listen(process.env.PORT || 3000);

const { default: makeWASocket, useMultiFileAuthState, delay, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');

async function start() {
    // 1. استخدام اسم جلسة جديد تماماً لتجنب التعليق
    const { state, saveCreds } = await useMultiFileAuthState('session_ultimate');
    
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
        // 2. تعريف متصفح أكثر استقراراً
        browser: ["Mac OS", "Chrome", "110.0.5481.177"],
        printQRInTerminal: false
    });

    if (!sock.authState.creds.registered) {
        const phoneNumber = "201055719273"; 
        console.log('⏳ جاري طلب كود الربط النهائي...');
        await delay(8000); 
        try {
            const code = await sock.requestPairingCode(phoneNumber);
            console.log(`\n\n✅ كود الربط الخاص بك هو: ${code}\n\n`);
        } catch (err) {
            console.log('❌ فشل طلب الكود، أعد المحاولة.');
        }
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) start();
        } else if (connection === 'open') {
            console.log('✅✅ مبروك! تم الربط بنجاح وجيش الظلال استيقظ.');
        }
    });

    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;
        if (msg.message.conversation === '.start') {
            await sock.sendMessage(msg.key.remoteJid, { text: '⚔️ ARISE! \nلقد تم الربط بنجاح.' });
        }
    });

    console.log('✅ البوت يعمل الآن...');
}
start();
