const http = require('http');
http.createServer((req, res) => { res.write('Song Jinwoo is Alive!'); res.end(); }).listen(process.env.PORT || 3000);

const { default: makeWASocket, useMultiFileAuthState, delay } = require('@whiskeysockets/baileys');
const pino = require('pino');

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState('session');
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
        browser: ["Ubuntu", "Chrome", "20.0.04"]
    });

    // سطر طلب كود الربط لرقمك
    if (!sock.authState.creds.registered) {
        const phoneNumber = "201055719273"; 
        await delay(5000);
        const code = await sock.requestPairingCode(phoneNumber);
        console.log(`\n\n🔗 كود الربط الخاص بك هو: ${code}\n\n`);
    }

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;
        if (msg.message.conversation === '.start') {
            await sock.sendMessage(msg.key.remoteJid, { text: '⚔️ ARISE! \nجيش الظلال مستعد.' });
        }
    });
    console.log('✅ Bot is running...');
}
start();
