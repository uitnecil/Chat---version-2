import { uuid } from '../util/uuid';
import { MessageModel } from './message-model';

export class ThreadModel {
  id: string;
  name: string;
  avatarSrc: string;
  lastMessage: MessageModel;

  constructor(id?: string,
              name?: string,
              avatarSrc?: string,
              lastMessage?: MessageModel) {
    this.id = id || uuid();
    this.name = name;
    this.avatarSrc = avatarSrc;
    this.lastMessage = lastMessage;
  }
}
