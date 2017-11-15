import { inject, TestBed } from '@angular/core/testing';

import { ThreadsService } from './threads.service';
import { MessagesService } from './messages.service';
import { ThreadModel } from './models/thread-model';
import { UserModel } from './models/user-model';
import { MessageModel } from './models/message-model';
import * as moment from 'moment';

describe('ThreadsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThreadsService, MessagesService]
    });
  });

  it('should be created', inject([ThreadsService], (service: ThreadsService) => {
    expect(service).toBeTruthy();
  }));

  it('should work', () => {
    const messagesService: MessagesService = new MessagesService();
    const threadsService: ThreadsService = new ThreadsService(messagesService);

    const user: UserModel = new UserModel('Nate', '');
    const t1: ThreadModel = new ThreadModel('t1', 'Nate', '');
    const t2: ThreadModel = new ThreadModel('t2', 'Lice', '');
    const t3: ThreadModel = new ThreadModel('t3', 'Jon', '');

    const m1: MessageModel = new MessageModel({
      author: user,
      text: 'Hi',
      thread: t1,
      sentAt: moment().add(1, 'h').add(15, 'm').toDate()
    });

    const m2: MessageModel = new MessageModel({
      author: user,
      text: 'Bye!',
      thread: t1,
      sentAt: moment().add(1, 'h').add(15, 'm').add(1, 's').toDate()
    });
    const m3: MessageModel = new MessageModel({
      author: user,
      text: 'Pfuai, sa-mi bag pula :))',
      thread: t2,
      sentAt: moment().add(1, 'h').toDate()
    });
    const m4: MessageModel = new MessageModel({
      author: user,
      text: 'Unde pula mea suntem ?',
      thread: t3,
      sentAt: moment().add(1, 's').toDate()
    });

    // t1.lastMessage = m1;
    // t1.lastMessage = m2;
    // t2.lastMessage = m3;
    // t3.lastMessage = m4;

    messagesService.messages
      .subscribe((messages: MessageModel[]) => console.log(messages));

    threadsService.threads
      .subscribe((threads: { [key: string]: ThreadModel }) => {
          console.log(threads);
        },
        console.log,
        () => {
          console.log(`threads completed`);
        });

    // threadsService.orderedThreads
    //   .subscribe({
    //     next: (orderedThreadList: ThreadModel[]) => console.log(orderedThreadList),
    //     error: (err) => console.log(err),
    //     complete: () => console.log('complete')
    //   });

    messagesService.addMessage(m1);
    messagesService.addMessage(m2);
    messagesService.addMessage(m3);
    messagesService.addMessage(m4);


  });
});
