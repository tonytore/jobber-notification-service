import 'express-async-errors';
import http from 'http';
import { winstonLogger } from '@tonytore/jobber-shared';
import appConfig from '@notification/config';
import { Logger } from 'winston';
import { Application } from 'express';
import { healthRoutes } from '@notification/routes';
import { checkConnection } from '@notification/loki';
import { createConnection } from '@notification/queues/connection';

const SERVER_PORT = process.env.PORT || 4001;

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
  await createConnection()
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
