import { Injectable } from '@angular/core';
import { UserModel } from './models/user-model';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class UsersService {
  currentUser: Subject<UserModel> = new BehaviorSubject<UserModel>(null);

  public setCurrentUser(newUser: UserModel): void {
    this.currentUser.next(newUser);
  }

}


export const usersServiceInjectable: any[] = [
  UsersService
];
