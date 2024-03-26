export class Track {
  id: string;
  name: string;
  artistId: string | null = null;
  albumId: string | null = null;
  duration: number;

  constructor(
    name: string,
    duration: number,
    artistId?: string,
    albumId?: string,
  ) {
    this.name = name;
    this.duration = duration;
    this.artistId = artistId || null;
    this.albumId = albumId || null;
  }
}
