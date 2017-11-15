import { TestBed, inject } from '@angular/core/testing';

import { MessagesService } from './messages.service';
import { UserModel } from './models/user-model';
import { ThreadModel } from './models/thread-model';
import { MessageModel } from './models/message-model';

describe('MessagesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessagesService]
    });
  });

  it('should be created', inject([MessagesService], (service: MessagesService) => {
    expect(service).toBeTruthy();
  }));

  it('should generate messages', () => {
    const user: UserModel = new UserModel('Nate', '');
    const thread: ThreadModel = new ThreadModel('t1', 'Nate', '');
    const m1: MessageModel = new MessageModel({
      author: user,
      text: 'Hi',
      thread: thread
    });

    const m2: MessageModel = new MessageModel({
      author: user,
      text: 'Bye!',
      thread: thread
    });

    // subscribe to streams
    const messageService: MessagesService = new MessagesService();

    messageService.newMessages
      .subscribe((message: MessageModel) => {
        console.log(message);
        expect(message instanceof MessageModel ).toBeTruthy();
      });

    messageService.messages
      .subscribe((messages: MessageModel[]) => {
      console.log('messages length', messages.length);
      expect(messages.length).toBeGreaterThanOrEqual(1);
      console.log('messages', messages);
      // expect(messages).toContain();
      });



    messageService.updates
      .subscribe((x) => {
      expect(typeof x).toEqual('function');
      console.log('typeof x: ', typeof x );
      });

    messageService.addMessage(m1);
    messageService.addMessage(m2);

    messageService.markThreadAsRead.next(thread);

  });
});
