const http = require('http');
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const pino = require('pino');

// نظام الحياة - إظهار النشاط لـ Render
http.createServer((req, res) => {
  res.write("Shadow Developers System is Active.");
  res.end();
}).listen(process.env.PORT || 3000);

async function startShadowBot() {
    console.log('🌑 [SYSTEM]: Initializing Shadow Army...');
    // تخزين الجلسة في مجلد shadow_session
    const { state, saveCreds } = await useMultiFileAuthState('shadow_session');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true, // سيظهر الكود في الـ Logs لمسحه
        logger: pino({ level: 'silent' })
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, qr } = update;
        
        if (qr) {
            console.log('💠 [QR]: كود الارتباط جاهز، قم بمسحه الآن عبر واتساب.');
        }

        if (connection === 'open') {
            console.log('✅ [STATUS]: Shadow Monarch has Awakened!');
            
            // إرسال الكود النهائي والإشعار لرقمك مباشرة
            const masterNumber = "201055719273@s.whatsapp.net";
            await sock.sendMessage(masterNumber, { 
                text: `🛡️ *نظام منظمة Shadow Devs*\n\nتم تفعيل البوت بنجاح يا سيد الظلال.\n\n👤 المطور: *𝑺𝒐𝒏𝒈 𝑱𝒊𝒏 𝑾𝒐𝒐*\n📜 الحالة: نشط (Active)\n🚀 السيرفر: Render Cloud\n\nنظامك الآن جاهز للسيطرة على النقابات.` 
            });
        }

        if (connection === 'close') {
            console.log('⚠️ [SYSTEM]: إعادة المحاولة...');
            startShadowBot(); 
        }
    });

    sock.ev.on('creds.update', saveCreds);
}

startShadowBot().catch(err => console.log('❌ [ERROR]: ' + err));
