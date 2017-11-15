import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/throttle';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/timeInterval';
import 'rxjs/add/operator/timestamp';
import 'rxjs/add/operator/pluck';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit, AfterViewInit {
  @ViewChild('clickIt') private clickIt: ElementRef;

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // const mouseUp$ = Observable.fromEvent(this.clickIt.nativeElement, 'mouseup')
    //   .timestamp()
    //   .do((ev) => console.log('mouse released!'))
    //   .debounceTime(1000)
    //   .timestamp()
    //   .do((x: any) => console.log(`emitted after ${x.timestamp - x.value.timestamp} ms`))
    //   .pluck('value', 'value');
    //
    // mouseUp$.subscribe(console.log);

  }
  
}
