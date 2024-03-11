import { Injectable } from '@nestjs/common';
import { Repository } from './repository/repository';
import { FavoritesRepository as FavoritesRep } from './repository/favoritesRepository'; // Renamed import for consistency
import { User } from '../user/entities/user.entity';
import { Track } from 'src/track/entities/track.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Album } from 'src/album/entities/album.entity';

@Injectable()
export class DatabaseService {
  public users: Repository<User>;
  public tracks: Repository<Track>;
  public artists: Repository<Artist>;
  public albums: Repository<Album>;
  public favorites: FavoritesRep;

  constructor() {
    this.users = new Repository<User>();
    this.tracks = new Repository<Track>();
    this.artists = new Repository<Artist>();
    this.albums = new Repository<Album>();
    this.favorites = new FavoritesRep();
  }
}
