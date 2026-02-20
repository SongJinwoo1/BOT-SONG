const http = require('http');
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');

// نظام الحياة لضمان نشاط البوت على Render
http.createServer((req, res) => {
  res.write("Shadow Monarch System is Active.");
  res.end();
}).listen(process.env.PORT || 3000);

async function startShadowBot() {
    const { state, saveCreds } = await useMultiFileAuthState('shadow_session');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, qr } = update;
        if (qr) console.log('💠 امسح الكود من سجلات Render الآن.');
        if (connection === 'open') {
            // إرسال رسالة التفعيل لرقمك المصري
            await sock.sendMessage("201055719273@s.whatsapp.net", { 
                text: "🛡️ تم استنهاض نظام Shadow Devs بنجاح يا سيد الظلال!" 
            });
        }
        if (connection === 'close') startShadowBot();
    });
    sock.ev.on('creds.update', saveCreds);
}
startShadowBot();
