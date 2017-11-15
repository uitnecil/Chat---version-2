import { Injectable } from '@angular/core';
import { MessagesService } from './messages.service';
import { ThreadModel } from './models/thread-model';
import { Observable } from 'rxjs/Observable';
import { MessageModel } from './models/message-model';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/distinct';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/distinctUntilKeyChanged';
import 'rxjs/add/observable/from';

import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ThreadsService {
  threads: Observable<{ [key: string]: ThreadModel }>;
  currentThread: Subject<ThreadModel> = new BehaviorSubject<ThreadModel>(new ThreadModel());
  orderedThreads: Observable<ThreadModel[]>;
  currentThreadMessages: Observable<MessageModel[]>;

  constructor(private messagesService: MessagesService) {

    // list of threads
    this.threads = this.messagesService.messages
      .mergeMap((messages: MessageModel[]) => Observable.from(messages)
          .distinct((v: MessageModel) => v.thread.id)
          .reduce((acc, val: MessageModel) => {
            return { ...acc, ...({ [val.thread.id]: val.thread }) };
          }, {})
           // v1
          .mergeMap((threadList: { [key: string]: ThreadModel }) => {
            return Observable.from(messages)
              .map((msg: MessageModel) => {
                if (!threadList[msg.thread.id].lastMessage || threadList[msg.thread.id].lastMessage.sentAt < msg.sentAt) {
                  threadList[msg.thread.id].lastMessage = msg;
                }
                return threadList;
              });
          })
        // v2
        // .map((threadList: { [key: string]: ThreadModel }) => {
        //   messages.map((msg: MessageModel) => {
        //     if (!threadList[msg.thread.id].lastMessage || threadList[msg.thread.id].lastMessage.sentAt < msg.sentAt) {
        //       threadList[msg.thread.id].lastMessage = msg;
        //     }
        //     return msg;
        //   });
        //   return threadList;
        // })
      )
      // .distinctUntilChanged()
      .shareReplay(1);

    // start recording threads
    this.threads.subscribe();

    this.orderedThreads = this.threads
      .map((incomingThreads: { [key: string]: ThreadModel }) => {
        const threads: ThreadModel[] = _.values(incomingThreads);
        threads.sort((v1: ThreadModel, v2: ThreadModel) => (v1.lastMessage.sentAt < v2.lastMessage.sentAt) ? 1 : -1);
        return threads;
      });

    this.currentThreadMessages = this.currentThread
      .combineLatest(this.messagesService.messages, (currentThread: ThreadModel, messages: MessageModel[]) => [currentThread, messages])
      .map(([currentThread, messages]: [ThreadModel, MessageModel[]]) => {
      if (currentThread && messages.length > 0) {
        return messages.filter((message: MessageModel) => message.thread.id === currentThread.id)
          .map((message: MessageModel) =>  {
            message.isRead = true;
            return message;
          });
      } else {
        return [];
      }
      });

    this.currentThread
      .subscribe(this.messagesService.markThreadAsRead);

  }

  setCurrentThread(newThread: ThreadModel) {
    this.currentThread.next(newThread);
  }
}


export const threadsServiceInjectable: any[] = [
  ThreadsService
];
