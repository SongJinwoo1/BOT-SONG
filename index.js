const http = require('http');

// كود نبض الحياة لإبقاء السيرفر يعمل على Render ومنع إغلاقه تلقائياً
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
        browser: ["Ubuntu", "Chrome", "20.0.04"] // ضروري لطلب كود الربط
    });

    // ---- نظام الربط بالكود للرقم الجديد ----
    if (!sock.authState.creds.registered) {
        const phoneNumber = "9657805334"; // رقمك الجديد الذي زودتني به
        await delay(5000); // انتظار لضمان استقرار الاتصال بالسيرفر
        try {
            const code = await sock.requestPairingCode(phoneNumber);
            console.log(`\n\n🔗 كود الربط الجديد هو: ${code}\n\n`);
        } catch (err) {
            console.log('خطأ في طلب الكود: ', err);
        }
    }
    // ------------------------------------------

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const body = msg.message.conversation || msg.message.extendedTextMessage?.text || "";

        if (body === '.start') {
            await sock.sendMessage(msg.key.remoteJid, { 
                text: `⚔️ ARISE! \nجيش الظلال مستعد للخدمة.` 
            });
        }
    });

    sock.ev.on('connection.update', (update) => {
        const { connection } = update;
        if (connection === 'open') {
            console.log('✅ تم ربط الرقم الجديد بنجاح!');
        }
    });

    console.log('✅ Bot is running...');
}

start();
