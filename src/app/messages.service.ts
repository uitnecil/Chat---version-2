import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { MessageModel } from './models/message-model';
import { ThreadModel } from './models/thread-model';
import { UserModel } from './models/user-model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/distinctUntilChanged';

type IMessageOperation = (messages: MessageModel[]) => MessageModel[];

@Injectable()
export class MessagesService {
  newMessages: Subject<MessageModel> = new Subject<MessageModel>();
  messages: Observable<MessageModel[]>;
  updates: Subject<any> = new Subject<any>();
  create: Subject<MessageModel> = new Subject<MessageModel>();
  markThreadAsRead: Subject<ThreadModel> = new Subject<ThreadModel>();

  constructor() {
    const initialMessages = [];

    this.messages = this.updates
      .scan((messages: MessageModel[], operation: IMessageOperation) => operation(messages), initialMessages)
      .distinctUntilChanged()
      .shareReplay(1);

    // this.messages.subscribe();

    this.create
      .map(genOperationAddMessage)
      .subscribe(this.updates);

    this.newMessages
      .subscribe(this.create);

    this.markThreadAsRead
      .map(genOperationMarkThreadAsRead)
      .subscribe(this.updates);


    // operation generator << Add New Message to an existing Messages list >>
    function genOperationAddMessage(message: MessageModel): IMessageOperation {
      return (messages: MessageModel[]): MessageModel[] => messages.concat(message);
    }

    // operation generator << Mark thread as read >>
    function genOperationMarkThreadAsRead(thread: ThreadModel): IMessageOperation {
      return (messages: MessageModel[]): MessageModel[] => messages.map((msg: MessageModel) => {
        if (msg.thread.id === thread.id) {
          msg.isRead = true;
        }
        return msg;
      });
    }


  }

  addMessage(message: MessageModel): void {
    this.newMessages.next(message);
  }

  messagesForThreadUser(thread: ThreadModel, user: UserModel): Observable<MessageModel> {
    return this.newMessages
      .filter((message: MessageModel) => message.thread.id === thread.id && message.author.id !== user.id);
  }
}

export const messagesServiceInjectable: any[] = [
  MessagesService
];
