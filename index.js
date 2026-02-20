const http = require('http');
http.createServer((req, res) => { res.write('𝑩𝑶𝑻 𝑺𝒐𝒏𝒈 𝑱𝒊𝒏 𝑾𝒐𝒐 is Online!'); res.end(); }).listen(process.env.PORT || 3000);

const { default: makeWASocket, useMultiFileAuthState, delay } = require('@whiskeysockets/baileys');
const pino = require('pino');

async function start() {
    // استخدام اسم جلسة فريد تماماً
    const { state, saveCreds } = await useMultiFileAuthState('session_jinwoo_final_v2');
    
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
        // تعريف متصفح أكثر استقراراً لتقليل أخطاء طلب الكود
        browser: ["Windows", "Chrome", "11.0.0"],
        printQRInTerminal: false
    });

    if (!sock.authState.creds.registered) {
        const phoneNumber = "201055719273"; 
        console.log('⏳ جاري محاولة طلب كود الربط بطريقة آمنة...');
        await delay(15000); // زيادة وقت الانتظار لضمان استقرار السيرفر
        try {
            const code = await sock.requestPairingCode(phoneNumber);
            console.log(`\n\n✅ كود الربط الخاص بك هو: ${code}\n\n`);
        } catch (err) {
            console.log('❌ واتساب رفض الطلب حالياً، يرجى عمل Clear Cache والانتظار دقيقتين.');
        }
    }

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;
        if (msg.message.conversation === '.start') {
            await sock.sendMessage(msg.key.remoteJid, { text: '⚔️ *ARISE!*\n\nتم تفعيل *𝑩𝑶𝑻 𝑺𝒐𝒏𝒈 𝑱𝒊𝒏 𝑾𝒐𝒐* بنجاح.' });
        }
    });
}
start();
