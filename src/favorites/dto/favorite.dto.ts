import { Track } from '../../track/entities/track.entity';
import { Album } from '../../album/entities/album.entity';
import { Artist } from '../../artist/entities/artist.entity';

export class FavoritesResponseDto {
  tracks: Track[];
  albums: Album[];
  artists: Artist[];
}
