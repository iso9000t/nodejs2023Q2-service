import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Artist } from './entities/artist.entity';
import { DatabaseService } from '../database/database.service';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { CreateArtistDto } from './dto/create-artist.dto';

@Injectable()
export class ArtistService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createArtistDto: CreateArtistDto): Artist {
    const artistId = uuidv4();
    const artistToCreate = new Artist();
    artistToCreate.id = artistId;
    Object.assign(artistToCreate, createArtistDto);
    this.databaseService.artists.add(artistId, artistToCreate);
    return artistToCreate;
  }

  findAll(): Artist[] {
    return this.databaseService.artists.fetchAll();
  }

  findOne(artistId: string): Artist {
    const artistExists = this.databaseService.artists.exists(artistId);
    if (!artistExists) {
      throw new NotFoundException(`Artist with ID ${artistId} not found.`);
    }
    const artist = this.databaseService.artists.find(artistId);
    return artist;
  }

  update(artistId: string, updateArtistDto: UpdateArtistDto): Artist {
    this.ensureArtistExists(artistId);
    const artistToUpdate = this.databaseService.artists.find(artistId);
    const updatedArtist = { ...artistToUpdate, ...updateArtistDto };

    this.databaseService.artists.add(artistId, updatedArtist);
    return updatedArtist;
  }

  remove(artistId: string): void {
    this.ensureArtistExists(artistId);
    this.databaseService.artists.delete(artistId);
  }

  private ensureArtistExists(artistId: string): void {
    if (!this.databaseService.artists.exists(artistId)) {
      throw new NotFoundException(`Artist with ID ${artistId} not found.`);
    }
  }
}
