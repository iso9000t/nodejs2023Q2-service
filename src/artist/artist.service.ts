import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { DatabaseService } from '../database/database.service';
import { plainToClass } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistService {
  constructor(private dbService: DatabaseService) {}

  create(createDto: CreateArtistDto): Artist {
    const newId = uuidv4();
    const artistEntry = new Artist();
    artistEntry.id = newId;
    Object.assign(artistEntry, createDto);

    this.dbService.artists.add(newId, artistEntry);
    return artistEntry;
  }

  findAll(): Artist[] {
    return this.dbService.artists.fetchAll();
  }

  findOne(artistId: string): Artist {
    const artist = this.dbService.artists.getOne(artistId);
    if (!artist)
      throw new NotFoundException(`No artist found with ID ${artistId}`);
    return artist;
  }

  update(artistId: string, updateDto: UpdateArtistDto): Artist {
    const existingArtist = this.findOne(artistId);
    const updatedArtist = plainToClass(Artist, {
      ...existingArtist,
      ...updateDto,
    });
    this.dbService.artists.add(artistId, updatedArtist);
    return updatedArtist;
  }

  remove(artistId: string): void {
    this.validateArtistExistence(artistId);
    this.dbService.artists.delete(artistId);
    this.clearRelatedEntities(artistId);
  }

  private validateArtistExistence(artistId: string): void {
    if (!this.dbService.artists.exists(artistId)) {
      throw new NotFoundException(`Artist with ID ${artistId} does not exist.`);
    }
  }

  private clearRelatedEntities(artistId: string): void {
    this.clearAlbums(artistId);
    this.clearTracks(artistId);
    this.dbService.favorites.deleteFav(artistId, 'artists');
  }

  private clearAlbums(artistId: string): void {
    this.dbService.albums.fetchAll().forEach((album) => {
      if (album.artistId === artistId) {
        this.dbService.albums.add(album.id, { ...album, artistId: null });
      }
    });
  }

  private clearTracks(artistId: string): void {
    this.dbService.tracks.fetchAll().forEach((track) => {
      if (track.artistId === artistId) {
        this.dbService.tracks.add(track.id, { ...track, artistId: null });
      }
    });
  }
}
