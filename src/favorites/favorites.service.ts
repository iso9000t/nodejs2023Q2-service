import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Favorites } from './entities/favorites.entity';

@Injectable()
export class FavoritesService {
  constructor(private dbService: DatabaseService) {}

  findAll() {
    const {
      artists: artistIds,
      albums: albumIds,
      tracks: trackIds,
    } = this.dbService.favorites.getAllFavs();

    const artists = artistIds.map((artistId) =>
      this.dbService.artists.getOne(artistId),
    );
    const albums = albumIds.map((albumId) =>
      this.dbService.albums.getOne(albumId),
    );
    const tracks = trackIds.map((trackId) =>
      this.dbService.tracks.getOne(trackId),
    );

    return { artists, albums, tracks };
  }

  add(itemId: string, category: keyof Favorites) {
    const itemExists = this.dbService[category].exists(itemId);
    if (!itemExists) {
      throw new UnprocessableEntityException(
        `Item of type ${category} with ID ${itemId} not found.`,
      );
    }

    this.dbService.favorites.addFav(itemId, category);
  }

  remove(itemId: string, category: keyof Favorites) {
    const favExists = this.dbService.favorites.favExists(itemId, category);
    if (!favExists) {
      throw new NotFoundException(
        `Favorite ${category} with ID ${itemId} not found.`,
      );
    }

    this.dbService.favorites.deleteFav(itemId, category);
  }
}
