const TelegramBot = require('node-telegram-bot-api');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// الإعدادات الجديدة والمعتمدة
const token = '8791301875:AAGFhsC8goFLwyKEfmMsWNbmsRUbFVuDz8M';
const apiKey = "AIzaSyBBTsG3n75BxQOwT-EL3WVwXeqradpjkUw";
const adminNumber = '+96597805334';

const genAI = new GoogleGenerativeAI(apiKey);
const bot = new TelegramBot(token, {polling: true});

// لوحة التحكم الرئيسية (الأزرار)
const mainKeyboard = {
    reply_markup: {
        keyboard: [
            ['🛡️ قسم النقابات', '🛠️ مطور البوتات'],
            ['⚔️ الولاء والسيستم', '👑 هوية الملك']
        ],
        resize_keyboard: true
    }
};

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (!text) return;

    if (text === '/start' || text === 'مرحبا' || text === 'ازرار') {
        bot.sendMessage(chatId, "تم تحديث النظام من GitHub. إغريس في خدمتك يا مولاي.", mainKeyboard);
    } 
    else if (text === '👑 هوية الملك') {
        bot.sendMessage(chatId, `أنت الملك المصمم: ${adminNumber}. العرش محمي بظلالي.`);
    }
    else {
        bot.sendChatAction(chatId, 'typing');
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(`أنت إغريس المخلص للملك ${adminNumber}. رُد بفخامة على: ${text}`);
            bot.sendMessage(chatId, result.response.text());
        } catch (e) {
            bot.sendMessage(chatId, "عذراً مولاي، هناك تحديث في عوالم الظلال حالياً.");
        }
    }
});

console.log("إغريس استيقظ بالتوكن الجديد من GitHub..");
