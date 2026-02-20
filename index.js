const http = require('http');
http.createServer((req, res) => { res.write('𝑩𝑶𝑻 𝑺𝒐𝒏𝒈 𝑱𝒊𝒏 𝑾𝒐𝒐 is Online!'); res.end(); }).listen(process.env.PORT || 3000);

const { default: makeWASocket, useMultiFileAuthState, delay } = require('@whiskeysockets/baileys');
const pino = require('pino');

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState('session_ultimate');
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
        browser: ["𝑩𝑶𝑻 𝑺𝒐𝒏𝒈 𝑱𝒊𝒏 𝑾𝒐𝒐", "Chrome", "20.0.04"],
        printQRInTerminal: false
    });

    if (!sock.authState.creds.registered) {
        const phoneNumber = "201055719273"; // رقمك المصري
        console.log('⏳ جاري طلب كود الربط...');
        await delay(10000); 
        try {
            const code = await sock.requestPairingCode(phoneNumber);
            console.log(`\n\n✅ كود الربط الخاص بك هو: ${code}\n\n`);
        } catch (err) { console.log('❌ خطأ في طلب الكود'); }
    }

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;
        if (msg.message.conversation === '.start') {
            await sock.sendMessage(msg.key.remoteJid, { text: '⚔️ *ARISE!*\n\nأنا *𝑩𝑶𝑻 𝑺𝒐𝒏𝒈 𝑱𝒊𝒏 𝑾𝒐𝒐* تحت خدمتك.' });
        }
    });
    console.log('✅ البوت يعمل الآن...');
}
start();
