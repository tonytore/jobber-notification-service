import dotenv from 'dotenv';

dotenv.config({});

class Config {
  public ENABLE_APM: string | undefined;
  public NODE_ENV: string | undefined;
  public CLIENT_URL: string | undefined;
  public RABBITMQ_ENDPOINT: string | undefined;
  public SENDER_EMAIL: string | undefined;
  public SENDER_EMAIL_PASSWORD: string | undefined;
  public LOKI_URL: string | undefined;

  constructor() {
    this.ENABLE_APM = process.env.ENABLE_APM || '';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || '';
    this.SENDER_EMAIL = process.env.SENDER_EMAIL || '';
    this.SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD || '';
    this.LOKI_URL = process.env.LOKI_URL || '';
  }
}

const appConfig: Config = new Config();
export default appConfig;
