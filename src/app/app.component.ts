import { Component } from '@angular/core';
import { InitialSteps } from './data/init';
import { MessagesService } from './messages.service';
import { ThreadsService } from './threads.service';
import { UsersService } from './users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private messagesService: MessagesService,
              private threadsService: ThreadsService,
              private usersService: UsersService) {
    InitialSteps.initMessages(this.messagesService, threadsService, this.usersService);
    InitialSteps.setupBots(this.messagesService);
  }
}
