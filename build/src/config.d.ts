import 'dotenv/config';
declare class Config {
    ENABLE_APM: string | undefined;
    NODE_ENV: string | undefined;
    CLIENT_URL: string | undefined;
    RABBITMQ_ENDPOINT: string | undefined;
    SENDER_EMAIL: string | undefined;
    SENDER_EMAIL_PASSWORD: string | undefined;
    LOKI_URL: string | undefined;
    constructor();
}
declare const appConfig: Config;
export default appConfig;
