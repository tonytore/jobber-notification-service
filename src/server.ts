import 'express-async-errors';
import http from 'http';
import { IOrderMessage, winstonLogger } from '@tonytore/jobber-shared';
import appConfig from '@notification/config';
import { Logger } from 'winston';
import { Application } from 'express';
import { healthRoutes } from '@notification/routes';
import { checkConnection } from '@notification/loki';
import { createConnection } from '@notification/queues/connection';
import { Channel } from 'amqplib';
import { consumeAuthEmailMessage, consumeOrderEmailMessage } from '@notification/queues/email.consumer';

const SERVER_PORT = appConfig.PORT;

const options = {
  serviceName: 'NotificationServer',
  level: 'debug',
  lokiUrl: appConfig.LOKI_URL,
  enableLoki: true
};

const logger: Logger = winstonLogger(options);

export function start(app: Application): void {
  startServer(app);
  app.use('', healthRoutes);
  startQueues();
  startLoki();
}

async function startQueues(): Promise<void> {
  const emailChannel: Channel = (await createConnection()) as Channel;
  await consumeAuthEmailMessage(emailChannel);
  await consumeOrderEmailMessage(emailChannel);

  const messageDetails: IOrderMessage = {
    receiverEmail: `${appConfig.SENDER_EMAIL}`,
    template: 'orderDelivered',
    sellerId: '123',
    buyerId: '333',
    username: 'tonytore',
    title: 'test',
    description: 'test',
    deliveryDays: 'test',
    amount: 'test',
    orderId: 'test'
  };
  await emailChannel.assertExchange('order-email-notification', 'direct');
  const message2 = JSON.stringify(messageDetails);
  await emailChannel.publish('order-email-notification', 'order-email', Buffer.from(message2));
}

function startLoki(): void {
  checkConnection();
}

function startServer(app: Application): void {
  try {
    const httpServer: http.Server = http.createServer(app);
    logger.info(`Worker with process id og ${process.pid} on notification server has started`);
    httpServer.listen(SERVER_PORT, () => {
      logger.info(`Notification server listening on port ${SERVER_PORT}`);
    });
  } catch (error) {
    logger.log('error', 'NotificationService startServer()', error);
  }
}
