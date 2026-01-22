import { Channel } from 'amqplib';
export declare function createConnection(): Promise<Channel | undefined>;
