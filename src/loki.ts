import axios from 'axios';
import appConfig from '@notification/config';
import { winstonLogger } from '@tonytore/jobber-shared';
import { Logger } from 'winston';

const log: Logger = winstonLogger({
  serviceName: 'NotificationServer',
  level: 'debug',
  lokiUrl: appConfig.LOKI_URL,
  enableLoki: true
});

export async function checkConnection(): Promise<void> {
  const LOKI_URL = appConfig.LOKI_URL || 'http://localhost:3100';
  const maxAttempts = 30;
  const delayMs = 2000;

  log.info(`Waiting for Loki to become ready at ${LOKI_URL}/ready ...`);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await axios.get(`${LOKI_URL}/ready`, { timeout: 5000 });

      if (response.status === 200 && response.data.trim() === 'ready') {
        log.info(`Loki is ready! (took ~${(attempt * delayMs) / 1000}s)`);
        return;
      }

      log.warn(`Loki not ready yet (attempt ${attempt}/${maxAttempts}): ${response.data.trim() || response.statusText}`);
    } catch (error: any) {
      log.error(`Loki readiness check failed (attempt ${attempt}/${maxAttempts}): ${error.message}`);
    }

    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  throw new Error(`Loki did not become ready after ${maxAttempts} attempts. Check Loki container/logs.`);
}
