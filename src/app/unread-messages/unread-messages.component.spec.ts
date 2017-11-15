import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnreadMessagesComponent } from './unread-messages.component';

describe('UnreadMessagesComponent', () => {
  let component: UnreadMessagesComponent;
  let fixture: ComponentFixture<UnreadMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnreadMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnreadMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
