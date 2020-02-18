  
import sheduleAction from './sheduler';
import TgBot from './tgBot';
import config from './config';
import Mailbox from './mailbox';

function app() {
    let tgBot = new TgBot(config.tgBotToken, config.userId);
    let mailbox = new Mailbox(config.emailLogin, config.emailPpassword)
    tgBot.start();
    sheduleAction(config.checkTime, async () => {
        let info = await getMailData(mailbox);
        tgBot.sendResultMessage(info)
    });
}



async function getMailData(mailbox) {
    let mails = await mailbox.readMails();
        console.log('filtering')

        mails = mails.filter(item => {
            console.log(item);
            return item.headers 
            && item.headers.from 
            && item.headers.from.includes('Yandex.Money') 
            && item.headers.subject 
            && item.headers.subject.includes('РЕЕСТР ПЛАТЕЖЕЙ В')
        })

        return mails.length;

/*         if(mails[0]) {
            let mailMarkup = mails[0].html;
            let codePosition = mailMarkup.indexOf('<font size="6">') + 15;
            let code = mailMarkup.slice(codePosition, codePosition + 6);
            console.log(code);
            if(code) {
                let codeInput = await page.$('input[name=security_code]');
                codeInput.type(code, { delay: 50 });
                await page.waitFor(2000);
                const submitButton = await page.$('form button');
                await submitButton.click();
                await page.waitFor(2000);
            }
        } */
}

app()