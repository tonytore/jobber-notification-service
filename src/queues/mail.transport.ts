import { emailTemplates } from "@notification/helpers";
import { IEmailLocals, winstonLogger } from "@tonytore/jobber-shared";
import { Logger } from "winston";

const logger:Logger = winstonLogger({
    serviceName: 'mailTransport',
    level: 'debug',
    lokiUrl: process.env.LOKI_URL,
    enableLoki: true
})

async function sendEmail(template:string, receiverEmail:string, locals:IEmailLocals):Promise<void>{
    try {
        // email template
        emailTemplates(template, receiverEmail, locals)
        logger.info('email sent successfully')
    } catch (error) {
        logger.log('error', 'NotificationService sendEmail() method', error)
    }
}

export {sendEmail}