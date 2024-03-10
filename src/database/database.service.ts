import { Injectable } from '@nestjs/common';
import { Repository } from './repository/repository';
import { User } from '../user/entities/user.entity';

@Injectable()
export class DatabaseService {
  public users: Repository<User>;

  constructor() {
    this.users = new Repository<User>();
  }
}
