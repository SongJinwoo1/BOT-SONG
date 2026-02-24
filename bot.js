const TelegramBot = require('node-telegram-bot-api');

// استبدل TOKEN_HERE بالتوكن الذي حصلت عليه من BotFather
const token = 'TOKEN_HERE'; 
const bot = new TelegramBot(token, {polling: true});

const webAppUrl = 'https://songjinwoo1.github.io/BOT-SONG/';

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    
    bot.sendMessage(chatId, 'مرحباً بك في نظام سونغ جين وو ⚔️\nيمكنك الآن إدارة النقابات والمهام عبر التطبيق المصغر:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'فتح لوحة التحكم 🖥️', web_app: { url: webAppUrl } }]
            ]
        }
    });
});

// رسالة ترحيبية عند الضغط على زر المساعدة
bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id, "أهلاً بك! استخدم أمر /start لفتح الواجهة.");
});

console.log("البوت يعمل الآن بنجاح...");
