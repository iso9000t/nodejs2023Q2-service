import { Track } from '../../track/entities/track.entity';
import { Album } from '../../album/entities/album.entity';
import { Artist } from '../../artist/entities/artist.entity';

export class FavoritesResponseDto {
  readonly artists: Artist[];
  readonly albums: Album[];
  readonly tracks: Track[];

  constructor(artists: Artist[], albums: Album[], tracks: Track[]) {
    this.artists = artists;
    this.albums = albums;
    this.tracks = tracks;
  }
}
