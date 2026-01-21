import appConfig from '@notification/config';
import { winstonLogger } from '@tonytore/jobber-shared';
import client, { Channel, ChannelModel } from 'amqplib';
import { Logger } from 'winston';

const logger: Logger = winstonLogger({
  serviceName: 'NotificationQueueConnection',
  level: 'debug',
  lokiUrl: appConfig.LOKI_URL,
  enableLoki: true
});

export async function createConnection(): Promise<Channel | undefined> {
  try {
    const connection: ChannelModel = await client.connect(`${appConfig.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();
    logger.info('Notification Service Connected to queue successfully');
    closeConnection(channel, connection);
    return channel;
  } catch (error) {
    logger.log('error', 'connectToRabbitMQ() method', error);
    return undefined;
  }
}

function closeConnection(channel: Channel, connection: ChannelModel): void {
  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });
}
