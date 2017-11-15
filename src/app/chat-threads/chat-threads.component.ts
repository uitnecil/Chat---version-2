import { Component, OnInit } from '@angular/core';
import { ThreadModel } from '../models/thread-model';
import { ThreadsService } from '../threads.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';

@Component({
  selector: 'app-chat-threads',
  templateUrl: './chat-threads.component.html',
  styleUrls: ['./chat-threads.component.css']
})
export class ChatThreadsComponent implements OnInit {
  threads: Observable<ThreadModel[]>;
  currentThread: ThreadModel;
  // force pipe refresh
  refreshViewTimeCounter = 0;
  constructor(public threadsService: ThreadsService) {
  }

  ngOnInit() {
    this.threads = this.threadsService.orderedThreads;
    this.threads.subscribe();
    this.threadsService.currentThread.subscribe((curThr: ThreadModel) => {
      this.currentThread = curThr;
    });

    // every 10 seconds increase the counter that forces the refresh of the pipe that displays
    // the age of each message in the view in the Threads view
    Observable.interval(10000)
      .do(() => {
        this.refreshViewTimeCounter = ( this.refreshViewTimeCounter > 10000 ) ? 0 : this.refreshViewTimeCounter + 1;
      })
      .subscribe();

  }

  setCurrentThread(newThread: ThreadModel): void {
    // if (this.currentThread !== newThread) {
      this.threadsService.setCurrentThread(newThread);
    // }
  }

}
