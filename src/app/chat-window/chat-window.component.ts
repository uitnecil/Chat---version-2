import { Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { ThreadModel } from '../models/thread-model';
import { ThreadsService } from '../threads.service';
import { MessagesService } from '../messages.service';
import { UsersService } from '../users.service';
import { MessageModel } from '../models/message-model';
import { UserModel } from '../models/user-model';
import { Observable } from 'rxjs/Observable';



@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit {
  @ViewChild('scrollable') private scrollable: ElementRef;
  @ViewChild('inputMessage') private inputMessage: ElementRef;
  @HostBinding('class.chat-window-container-main') value = true;

  currentThread: ThreadModel;
  currentUser: UserModel;
  // currentThreadMessages: Observable<MessageModel[]>;
  currentThreadMessages: MessageModel[];

  // forces the refresh of the fromNow pipe in the view to automatically refresh
  refreshViewTimeCounter = 0;
  constructor(private threadsService: ThreadsService,
              private messagesService: MessagesService,
              private usersService: UsersService) { }

  ngOnInit() {
    this.threadsService.currentThread.subscribe((curThread: ThreadModel) => {
      this.currentThread = curThread;
      // remove any value from the input field
      this.inputMessage.nativeElement.value = '';
      // focus on the input field whenever the thread changes
      this.inputMessage.nativeElement.focus();
    });
    this.usersService.currentUser.subscribe((newUser: UserModel) => this.currentUser = newUser);
    this.threadsService.currentThreadMessages
      .subscribe((msgs: MessageModel[]) => {
      this.currentThreadMessages = msgs;
      // scroll down after view was refreshed
      setTimeout(() => this.scrollDown());
    });


    // every 10 seconds increase the counter that forces the refresh of the pipe that displays
    // the age of each message in the view in the Threads view
    Observable.interval(10000)
      .do(() => {
      this.refreshViewTimeCounter = ( this.refreshViewTimeCounter > 10000 ) ? 0 : this.refreshViewTimeCounter + 1;
    })
      .subscribe();
  }

  sendMessage(text: string): void {
    if (text) {
    const tempMessage: MessageModel = new MessageModel({
      author: this.currentUser,
      text: text,
      thread: this.currentThread,
      sentAt: new Date(),
      isRead: true
    });
    this.messagesService.addMessage(tempMessage);
}

  }

  scrollDown() {
    const scrollElement = this.scrollable.nativeElement;
    scrollElement.scrollTop = scrollElement.scrollHeight - scrollElement.clientHeight;
  }

}
