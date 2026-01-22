import appConfig from '@notification/config';
import { winstonLogger } from '@tonytore/jobber-shared';
import { Channel, ConsumeMessage } from 'amqplib';
import { Logger } from 'winston';
import { createConnection } from '@notification/queues/connection';

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
    await channel.consume(jobberQueue.queue, async (message: ConsumeMessage | null) => {
      if (message) {
        logger.info(`Received message: ${message!.content.toString()}`);
        channel.ack(message!);
      }
    }, { noAck: false });
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
      await channel.consume(jobberQueue.queue, async (message: ConsumeMessage | null) => {
        if (message) {
          logger.info(`Received message: ${message!.content.toString()}`);
          channel.ack(message!);
        }
      }, { noAck: false })
    } catch (error) {
      logger.log('error', 'NotificationService EmailConsumer consumeOrderEmailMessage() method error', error);
    }
  }

export {consumeAuthEmailMessage, consumeOrderEmailMessage};
