const http = require('http');
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');

// نظام الحياة ليبقى البوت نشطاً على Render
http.createServer((req, res) => {
  res.write("Shadow System is Active.");
  res.end();
}).listen(process.env.PORT || 3000);

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('shadow_session');
    const sock = makeWASocket({ auth: state, printQRInTerminal: true });

    sock.ev.on('connection.update', async (update) => {
        const { connection, qr } = update;
        if (qr) console.log('💠 امسح الكود الظاهر في السجلات الآن.');
        if (connection === 'open') {
            // إرسال رسالة التأكيد لرقمك
            await sock.sendMessage("201055719273@s.whatsapp.net", { 
                text: "🛡️ تم تفعيل نظام Shadow Devs بنجاح!" 
            });
        }
    });
    sock.ev.on('creds.update', saveCreds);
}
startBot();
