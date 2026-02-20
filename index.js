// Shadow Developers Bot Core - Created by Song Jin Woo
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const pino = require('pino');

async function startShadowBot() {
    // 1. نظام الحياة (Life Cycle) - مرحلة التهيئة
    console.log('🌑 [SYSTEM]: Initializing Shadow Army...');
    console.log('⚡ [SYSTEM]: Power Level: Beyond Measure.');

    const { state, saveCreds } = await useMultiFileAuthState('shadow_session');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'silent' })
    });

    // 2. نظام الحياة - عند اكتمال الاتصال
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('💠 [QR]: Shadow Portal is Open. Scan the QR Code.');
        }

        if (connection === 'open') {
            console.log('✅ [STATUS]: Shadow Monarch has Awakened!');
            console.log('🌍 [NETWORK]: Connection Established Successfully.');
            console.log('--- 𝑺𝒐𝒏𝒈 𝑱𝒊𝒏 𝑾𝒐𝒐 is now Active ---');
        }

        if (connection === 'close') {
            console.log('⚠️ [SYSTEM]: Connection Lost. Attempting to Re-awake...');
            startShadowBot(); // إعادة التشغيل تلقائياً
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // 3. معالجة الرسائل بلمسة منظمة Shadow Devs
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

        // أمر الترحيب (نظام المنظمة)
        if (text === '.start') {
            const sender = msg.key.remoteJid;
            await sock.sendMessage(sender, { 
                text: `🛡️ *ECLIPSE GUILD SYSTEM* 🌑\n\nWelcome to the Shadow Realm.\nYour Guild Bot is ready to serve.\n\nDeveloped by: *𝑺𝒐𝒏𝒈 𝑱𝒊𝒏 𝑾𝒐𝒐*` 
            });
        }
    });
}

// بدء التشغيل
startShadowBot().catch(err => console.log('❌ [ERROR]: Critical Failure: ' + err));
