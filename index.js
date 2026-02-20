const http = require('http');

// كود نبض الحياة لإبقاء السيرفر يعمل على Render ومنع إغلاقه
http.createServer((req, res) => {
  res.write('Song Jinwoo is Alive!');
  res.end();
}).listen(process.env.PORT || 3000);

const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    delay, 
    makeCacheableSignalKeyStore 
} = require('@whiskeysockets/baileys');
const pino = require('pino');

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState('session');
    
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
        browser: ["Ubuntu", "Chrome", "20.0.04"] // ضروري لعمل كود الربط
    });

    // ---- نظام الربط بالكود (بدلاً من الـ QR) ----
    if (!sock.authState.creds.registered) {
        const phoneNumber = "201055719273"; // رقم هاتفك الذي زودتني به
        await delay(5000); // انتظار بسيط لضمان استقرار الاتصال
        const code = await sock.requestPairingCode(phoneNumber);
        console.log(`\n\n🔗 كود الربط الخاص بك هو: ${code}\n\n`);
    }
    // ------------------------------------------

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const command = msg.message.conversation || msg.message.extendedTextMessage?.text;

        if (command === '.start') {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: `⚔️ ARISE! \nأنا Song Jinwoo في خدمتك .` 
            });
        }
    });

    sock.ev.on('connection.update', (update) => {
        const { connection } = update;
        if (connection === 'open') {
            console.log('✅ تم ربط الواتساب بنجاح! جيش الظلال مستعد.');
        }
    });

    console.log('✅ Bot is running...');
}

start();
