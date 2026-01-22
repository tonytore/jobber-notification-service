import express, { Express } from 'express';
import { start } from '@notification/server';
import { Logger } from 'winston';
import appConfig from '@notification/config';
import { winstonLogger } from '@tonytore/jobber-shared';

const logger: Logger = winstonLogger({
  serviceName: 'NotificationServer',
  level: 'info',
  lokiUrl: appConfig.LOKI_URL,
  enableLoki: true
});
function initialize(): void {
  const app: Express = express();
  start(app);
  logger.info('Notification server started');
}

initialize();
