const TelegramBot = require('node-telegram-bot-api');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// الإعدادات الملكية
const token = '8791301875:AAHRQTsrFhf86pxV7b0JMFRArsXmE-jZIKk';
const apiKey = "AIzaSyBBTsG3n75BxQOwT-EL3WVwXeqradpjkUw";
const adminNumber = '+96597805334';

const genAI = new GoogleGenerativeAI(apiKey);
const bot = new TelegramBot(token, {polling: true});

// الأزرار الرئيسية
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

    if (text === '/start') {
        bot.sendMessage(chatId, "مرحباً بك يا مولاي في نظامك المطور على GitHub. إغريس تحت أمرك.", mainKeyboard);
    } 
    else if (text === '👑 هوية الملك') {
        bot.sendMessage(chatId, `أنت الملك المصمم وصاحب الرقم المعتمد: ${adminNumber}`);
    }
    else {
        // ذكاء اصطناعي للردود الحرة
        bot.sendChatAction(chatId, 'typing');
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(`أنت إغريس، مساعد الملك ${adminNumber}. رُد بفخامة: ${text}`);
            bot.sendMessage(chatId, result.response.text());
        } catch (e) {
            bot.sendMessage(chatId, "عذراً مولاي، بوابة الظلال مشوشة حالياً.");
        }
    }
});

console.log("إغريس استيقظ من مخزن GitHub..");
