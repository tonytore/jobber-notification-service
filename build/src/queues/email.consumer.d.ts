import { Channel } from 'amqplib';
declare function consumeAuthEmailMessage(channel: Channel): Promise<void>;
export default consumeAuthEmailMessage;
