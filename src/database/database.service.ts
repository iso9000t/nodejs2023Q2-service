import { Injectable } from '@nestjs/common';
import { Repository } from './repository/repository';
import { User } from '../user/entities/user.entity';
import { Track } from 'src/track/entities/track.entity';

@Injectable()
export class DatabaseService {
  public users: Repository<User>;
  public tracks: Repository<Track>;

  constructor() {
    this.users = new Repository<User>();
    this.tracks = new Repository<Track>();
  }
}
