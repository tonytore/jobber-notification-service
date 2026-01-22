import { IEmailLocals } from '@tonytore/jobber-shared';
declare function sendEmail(template: string, receiverEmail: string, locals: IEmailLocals): Promise<void>;
export { sendEmail };
