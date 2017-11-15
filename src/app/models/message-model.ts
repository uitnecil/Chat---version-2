import { uuid } from '../util/uuid';
import { UserModel } from './user-model';
import { ThreadModel } from './thread-model';

export class MessageModel {
  id: string;
  sentAt: Date;
  isRead: boolean;
  text: string;
  author: UserModel;
  thread: ThreadModel;

  constructor(obj?: any) {
    this.id = obj && obj.id || uuid();
    this.sentAt = obj && obj.sentAt || new Date();
    this.isRead = obj && obj.isRead || false;
    this.text = obj && obj.text || null;
    this.author = obj && obj.author || null;
    this.thread = obj && obj.thread || null;
  }
}
