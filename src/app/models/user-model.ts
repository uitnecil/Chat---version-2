import { uuid } from '../util/uuid';

export class UserModel {
  id: string;
  avatarSrc: string;
  constructor(public name: string,
              avatarSrc: string) {
    this.id = uuid();
    this.avatarSrc = avatarSrc;
  }
}
