import { UserModel } from '../models/user-model';
import { ThreadModel } from '../models/thread-model';
import { MessageModel } from '../models/message-model';
import { MessagesService } from '../messages.service';
import { ThreadsService } from '../threads.service';
import { UsersService } from '../users.service';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/concatMap';
import 'rxjs/add/observable/timer';

const user1 = new UserModel('Lice', '../../assets/images/avatars/male-avatar-1.png');
const user2 = new UserModel('Zori', '../../assets/images/avatars/female-avatar-1.png');
const user3 = new UserModel('Larisa', '../../assets/images/avatars/female-avatar-2.png');
const user4 = new UserModel('Andrei', '../../assets/images/avatars/male-avatar-1.png');
const user5 = new UserModel('Stefanel', '../../assets/images/avatars/male-avatar-4.png');
// const user6 = new UserModel('Karina', '../../assets/images/avatars/female-avatar-4.png');
// const user7 = new UserModel('Andreiutza', '../../assets/images/avatars/female-avatar-3.png');

const thread1 = new ThreadModel('', 'Zori', '../../assets/images/avatars/female-avatar-1.png');
const thread2 = new ThreadModel('', 'Larisa', '../../assets/images/avatars/female-avatar-2.png');
const thread3 = new ThreadModel('', 'Andrei', '../../assets/images/avatars/male-avatar-1.png');
const thread4 = new ThreadModel('', 'Stefanel', '../../assets/images/avatars/male-avatar-4.png');
// const thread5 = new ThreadModel('', 'Karina', '../../assets/images/avatars/female-avatar-4.png');
// const thread6 = new ThreadModel('', 'Andreiutza', '../../assets/images/avatars/female-avatar-3.png');

const initialMessages: MessageModel[] = [
  new MessageModel({
    author: user1,
    text: 'Sers!!',
    thread: thread1,
    sentAt: moment().add(-7, 'm').toDate()
  }),
  new MessageModel({
    author: user2,
    text: 'Salut!',
    thread: thread1,
    sentAt: moment().add(-5, 'm').toDate()
  }),
  new MessageModel({
    author: user3,
    text: 'Pe unde ai fost ?',
    thread: thread2,
    sentAt: moment().add(-4, 'm').toDate()
  }),
  new MessageModel({
    author: user4,
    text: 'Toate bune ?',
    thread: thread3,
    sentAt: moment().add(-19, 'm').toDate()
  }),
  new MessageModel({
    author: user5,
    text: 'Cand mai veniti pe la noi ?',
    thread: thread4,
    sentAt: new Date()
  })
//   ,
// new MessageModel({
//     author: user6,
//     text: 'Salut! ?',
//     thread: thread5,
//     sentAt: new Date()
//   }),
//   new MessageModel({
//     author: user7,
//     text: 'Salut si bine v-am gasit! ?',
//     thread: thread6,
//     sentAt: new Date()
//   })
];

export class InitialSteps {
  // constructor() {}

  static initMessages(messagesService: MessagesService,
                      threadsService: ThreadsService,
                      usersService: UsersService) {
    initialMessages.map((msg: MessageModel) => messagesService.addMessage(msg));
    usersService.setCurrentUser(user1);
    threadsService.setCurrentThread(thread1);
  }

  static setupBots(messagesService: MessagesService) {
    messagesService.messagesForThreadUser(thread1, user2)
      .forEach((msg: MessageModel) => {
        const tempMsg = [new MessageModel({
          author: user2,
          // text: `Degeaba zici '${msg.text}' ca io-s Ratusca Pufoasa! !`,
          text: `Ce ? pe bune ?`,
          thread: thread1,
          sentAt: new Date()
        }),
          new MessageModel({
            author: user2,
            // text: `Degeaba zici '${msg.text}' ca io-s Ratusca Pufoasa! !`,
            text: `Chiar zici '${msg.text}' ?`,
            thread: thread1,
            sentAt: new Date()
          })
        ];
        // send messages with delay between them
        Observable.from(tempMsg)
          .concatMap((eachMsg: MessageModel) =>
            Observable.timer(Math.round(Math.random() * 500) + 1500)
              .map(() => {
                eachMsg.sentAt = new Date();
                messagesService.addMessage(eachMsg);
              })
          )
          // .subscribe(() => {}, console.log, () => console.log('done sending'));
          .subscribe();

      });

    messagesService.messagesForThreadUser(thread4, user5)
      .forEach((msg: MessageModel) => {
        const tempMsg = new MessageModel({
          author: user5,
          text: `Salut! tocmai mi-ai scris !`,
          thread: thread4,
          sentAt: new Date()
        });
        setTimeout(() => messagesService.addMessage(tempMsg), Math.round(Math.random() * 500) + 3000);

      });
  }
}
