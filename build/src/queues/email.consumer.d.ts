import { Channel } from 'amqplib';
declare function consumeAuthEmailMessage(channel: Channel): Promise<void>;
declare function consumeOrderEmailMessage(channel: Channel): Promise<void>;
export { consumeAuthEmailMessage, consumeOrderEmailMessage };
