import TelegramBot from 'node-telegram-bot-api';

export default class TgBot {
    constructor(token, userId) {
        this.bot = new TelegramBot(token, { polling: {autoStart: false } });
        this.userId = userId;
    }

    start() {
        this.bot.startPolling();
        this.setMessageHandlers();
        console.log('start telegram bot');
    }

    sendResultMessage(result) {
        this.bot.sendMessage(this.userId, result);
    }

    setMessageHandlers() {
        this.bot.on('message', (msg) => {
            let messageInfo = {
                text: msg.text,
                chatId: msg.chat.id,
            };
            console.log(msg.chat.id)
            this.bot.sendMessage(messageInfo.chatId, 'Привет!')
        });
    }

}
