import { Favorites } from '../../favorites/entities/favorites.entity';

export class FavoritesRepository implements Favorites {
  private _artists: string[];
  private _tracks: string[];
  private _albums: string[];

  constructor() {
    this._artists = [];
    this._tracks = [];
    this._albums = [];
  }

  get artists(): string[] {
    return [...this._artists];
  }

  get albums(): string[] {
    return [...this._albums];
  }

  get tracks(): string[] {
    return [...this._tracks];
  }

  getAllFavs(): Favorites {
    return {
      artists: this._artists,
      albums: this._albums,
      tracks: this._tracks,
    };
  }

  addFav(id: string, category: keyof Favorites): void {
    switch (category) {
      case 'artists':
        this._artists.push(id);
        break;
      case 'albums':
        this._albums.push(id);
        break;
      case 'tracks':
        this._tracks.push(id);
        break;
      default:
        throw new Error(`Unknown category: ${category}`);
    }
  }

  deleteFav(id: string, category: keyof Favorites): void {
    switch (category) {
      case 'artists':
        this._artists = this._artists.filter((artistId) => artistId !== id);
        break;
      case 'albums':
        this._albums = this._albums.filter((albumId) => albumId !== id);
        break;
      case 'tracks':
        this._tracks = this._tracks.filter((trackId) => trackId !== id);
        break;
      default:
        throw new Error(`Unknown category: ${category}`);
    }
  }

  favExists(id: string, category: keyof Favorites): boolean {
    switch (category) {
      case 'artists':
        return this._artists.includes(id);
      case 'albums':
        return this._albums.includes(id);
      case 'tracks':
        return this._tracks.includes(id);
      default:
        throw new Error(`Unknown category: ${category}`);
    }
  }
}
