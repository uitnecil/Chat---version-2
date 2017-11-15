import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { usersServiceInjectable } from './users.service';
import { threadsServiceInjectable } from './threads.service';
import { messagesServiceInjectable } from './messages.service';
import { ChatThreadsComponent } from './chat-threads/chat-threads.component';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { UnreadMessagesComponent } from './unread-messages/unread-messages.component';
import { FromNowPipe } from './from-now.pipe';
import { MoveMeDirective } from './move-me.directive';
import { ConsoleItPipe } from './console-it.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ChatThreadsComponent,
    ChatPageComponent,
    ChatWindowComponent,
    UnreadMessagesComponent,
    FromNowPipe,
    MoveMeDirective,
    ConsoleItPipe
  ],
  imports: [
    BrowserModule
  ],
  providers: [usersServiceInjectable,
    threadsServiceInjectable,
    messagesServiceInjectable],
  bootstrap: [AppComponent]
})
export class AppModule {
}
