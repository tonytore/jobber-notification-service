import appConfig from '@notification/config';
import { IEmailLocals, winstonLogger } from '@tonytore/jobber-shared';
import { Channel, ConsumeMessage } from 'amqplib';
import { Logger } from 'winston';
import { createConnection } from '@notification/queues/connection';
import { sendEmail } from './mail.transport';

const logger: Logger = winstonLogger({
  serviceName: 'EmailConsumer',
  level: 'debug',
  lokiUrl: appConfig.LOKI_URL,
  enableLoki: true
});

async function consumeAuthEmailMessage(channel: Channel): Promise<void> {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangName = 'auth-email-notification';
    const routingQueue = 'auth-email';
    const queueName = 'auth-email-queue';
    await channel.assertExchange(exchangName, 'direct');
    const jobberQueue = await channel.assertQueue(queueName, {
      durable: true,
      autoDelete: false
    });

    await channel.bindQueue(jobberQueue.queue, exchangName, routingQueue);
    await channel.consume(
      jobberQueue.queue,
      async (message: ConsumeMessage | null) => {
        if (message) {
          const { receiverEmail, username, verifyLink, resetLink, template } = JSON.parse(message.content.toString());
          const locals: IEmailLocals = {
            appLink: `${appConfig.SENDER_EMAIL}`,
            appIcon: 'https://ibb.co/wr75808w',
            username,
            verifyLink,
            resetLink
          };
          await sendEmail(template, receiverEmail, locals);
          logger.info(`Received message: ${message!.content.toString()}`);
          channel.ack(message!);
        }
      },
      { noAck: false }
    );
  } catch (error) {
    logger.log('error', 'NotificationService EmailConsumer consumeAuthEmailMessage() method error', error);
  }
}

async function consumeOrderEmailMessage(channel: Channel): Promise<void> {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangName = 'order-email-notification';
    const routingQueue = 'order-email';
    const queueName = 'order-email-queue';
    await channel.assertExchange(exchangName, 'direct');
    const jobberQueue = await channel.assertQueue(queueName, {
      durable: true,
      autoDelete: false
    });

    await channel.bindQueue(jobberQueue.queue, exchangName, routingQueue);
    await channel.consume(
      jobberQueue.queue,
      async (msg: ConsumeMessage | null) => {
        if (msg) {
          const {
            receiverEmail,
            username,
            template,
            sender,
            offerLink,
            amount,
            buyerUsername,
            sellerUsername,
            title,
            description,
            deliveryDays,
            orderId,
            orderDue,
            requirements,
            orderUrl,
            originalDate,
            newDate,
            reason,
            subject,
            header,
            type,
            message,
            serviceFee,
            total
          } = JSON.parse(msg!.content.toString());
          const locals: IEmailLocals = {
            appLink: `${appConfig.SENDER_EMAIL}`,
            appIcon: 'https://i.ibb.co/Kyp2m0t/cover.png',
            username,
            sender,
            offerLink,
            amount,
            buyerUsername,
            sellerUsername,
            title,
            description,
            deliveryDays,
            orderId,
            orderDue,
            requirements,
            orderUrl,
            originalDate,
            newDate,
            reason,
            subject,
            header,
            type,
            message,
            serviceFee,
            total
          };
          // send emails
          if (template === 'orderPlaced') {
            await sendEmail('orderPlaced', receiverEmail, locals);
            await sendEmail('orderReceipt', receiverEmail, locals);
          } else {
            await sendEmail(template, receiverEmail, locals);
          }
          // acknoledge
          logger.info(`Received message: ${msg!.content.toString()}`);
          channel.ack(msg!);
        }
      },
      { noAck: false }
    );
  } catch (error) {
    logger.log('error', 'NotificationService EmailConsumer consumeOrderEmailMessage() method error', error);
  }
}

export { consumeAuthEmailMessage, consumeOrderEmailMessage };
