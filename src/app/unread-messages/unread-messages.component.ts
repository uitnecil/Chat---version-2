import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../messages.service';
import { MessageModel } from '../models/message-model';
import { ThreadsService } from '../threads.service';
import { ThreadModel } from '../models/thread-model';
import 'rxjs/add/operator/combineLatest';

@Component({
  selector: 'app-unread-messages',
  templateUrl: './unread-messages.component.html',
  styleUrls: ['./unread-messages.component.css']
})
export class UnreadMessagesComponent implements OnInit {
  public numberOfUnreadMessages: number;

  constructor(private messagesService: MessagesService,
              private threadsService: ThreadsService) {
    this.messagesService.messages
      .combineLatest(this.threadsService.currentThread, (messages: MessageModel[], currentThread: ThreadModel) => [messages, currentThread])
      .subscribe(([messages, currentThread]: [MessageModel[], ThreadModel]) => {
        this.numberOfUnreadMessages = messages
          .reduce((acc: number, val: MessageModel) =>
            ((val.isRead === false ) && (val.thread.id !== currentThread.id) ) ? acc + 1 : acc, 0);
      });
  }

  ngOnInit() {
  }

}
