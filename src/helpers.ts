import { IEmailLocals, winstonLogger } from '@tonytore/jobber-shared';
import { Logger } from 'winston';
import nodemailer, { Transporter } from 'nodemailer';
import appConfig from '@notification/config';
import Email from 'email-templates';
import path from 'path';

const logger: Logger = winstonLogger({
  serviceName: 'mailTransportHelper',
  level: 'debug',
  lokiUrl: process.env.LOKI_URL,
  enableLoki: true
});

export const emailTemplates = async(template: string, receiver: string, locals: IEmailLocals) => {
  try {
    const smtpTransporter: Transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: `${appConfig.SENDER_EMAIL}`,
        pass: `${appConfig.SENDER_EMAIL_PASSWORD}`
      }
    });

    const email = new Email({
      message: {
        from: `${appConfig.SENDER_EMAIL}`
      },
      send: true,
      preview: false,
      transport: smtpTransporter,
      views: {
        options: {
          extension: 'ejs'
        }
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, '../build')
        }
      }
    });

    await email.send({
      template : path.join(__dirname, '..', 'src/emails', template),
      message: {
        to: receiver
      },
      locals
    })
  } catch (error) {
    logger.log('error', 'NotificationService emailTemplates() method', error);
  }
};
