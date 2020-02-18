  
import sheduleAction from './sheduler';
import TgBot from './tgBot';
import config from './config';
import Mailbox from './mailbox';

function app() {
    let tgBot = new TgBot(config.tgBotToken, config.userId);
    let mailbox = new Mailbox(config.popHost, config.emailLogin, config.emailPassword)
    tgBot.start();
    sheduleAction(config.checkTime, async () => {
        let info = await getMailData(mailbox);
        tgBot.sendResultMessage(info)
    });
}

function dateSorter(m1, m2) {
    let d1 = (new Date(m1.date)).getTime();
    let d2 = (new Date(m2.date)).getTime();
    return d2 - d1;
}

async function getMailData(mailbox) {
    let mails = await mailbox.readMails();
        console.log('filtering')

    let paymentMail = mails.filter(item => {
        return item.headers 
        && item.headers.from 
        && item.headers.from.includes('Yandex.Money') 
        && item.headers.subject 
        && item.headers.subject.includes('РЕЕСТР ПЛАТЕЖЕЙ В')
    }).sort(dateSorter)[0];

    let returnMail = mails.filter(item => {
        return item.headers 
        && item.headers.from 
        && item.headers.from.includes('Yandex.Money') 
        && item.headers.subject 
        && item.headers.subject.includes('РЕЕСТР ВОЗВРАТОВ')
    }).sort(dateSorter)[0];

    let magic1 = ('Дата платежей: ').length;
    let magic2 = ('RUB').length;

    let dateStartIndex = paymentMail.text.indexOf('Дата платежей: ');
    let date = paymentMail.text.slice(dateStartIndex, dateStartIndex+10+magic1);
    let paymentStartIndex = paymentMail.text.indexOf('Сумма принятых платежей: ');
    let paymentEndIndex = paymentMail.text.indexOf('RUB');
    let payment = paymentMail.text.slice(paymentStartIndex, paymentEndIndex+magic2);
    let countStartIndex = paymentMail.text.indexOf('Число платежей: ');
    let countEndIndex = paymentMail.text.indexOf('\r\n', countStartIndex);
    let count = paymentMail.text.slice(countStartIndex, countEndIndex);

    let paymentResult = `${date}\r\n${payment}\r\n${count}`;

    magic1 = ('Дата возвратов: ').length;

    dateStartIndex = returnMail.text.indexOf('Дата возвратов: ');
    date = returnMail.text.slice(dateStartIndex, dateStartIndex+10+magic1);
    paymentStartIndex = returnMail.text.indexOf('Сумма возвратов: ');
    paymentEndIndex = returnMail.text.indexOf('\r\n', paymentStartIndex);
    payment = returnMail.text.slice(paymentStartIndex, paymentEndIndex);
    countStartIndex = returnMail.text.indexOf('Число возвратов: ');
    countEndIndex = returnMail.text.indexOf('\r\n', countStartIndex);
    count = returnMail.text.slice(countStartIndex, countEndIndex);

    let returnResult = `${date}\r\n${payment}\r\n${count}`;

    return `${paymentResult}\r\n\r\n${returnResult}`;
}

app()