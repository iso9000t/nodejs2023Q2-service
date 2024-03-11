import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../database/database.service';
import { Track } from './entities/track.entity';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TrackService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(trackData: CreateTrackDto): Track {
    const trackId = uuidv4();
    const artistExists = this.databaseService.artists.exists(
      trackData.artistId,
    );
    const albumExists = this.databaseService.albums.exists(trackData.albumId);

    const trackToAdd: Track = {
      id: trackId,
      name: trackData.name,
      artistId: artistExists ? trackData.artistId : null,
      albumId: albumExists ? trackData.albumId : null,
      duration: trackData.duration,
    };

    this.databaseService.tracks.add(trackId, trackToAdd);
    return trackToAdd;
  }

  findAll(): Track[] {
    return this.databaseService.tracks.fetchAll();
  }

  findOne(trackId: string): Track {
    const track = this.databaseService.tracks.getOne(trackId);
    if (!track) {
      throw new NotFoundException(`Track with ID ${trackId} not found.`);
    }
    return track;
  }

  update(trackId: string, updateTrackDto: UpdateTrackDto): Track {
    if (!this.databaseService.tracks.exists(trackId)) {
      throw new NotFoundException(`Track ${trackId} not found`);
    }
    const track = this.findOne(trackId);
    const updatedTrack = { ...track, ...updateTrackDto };

    this.databaseService.tracks.add(trackId, updatedTrack);
    return updatedTrack;
  }

  remove(trackId: string): void {
    const trackPresent = this.databaseService.tracks.exists(trackId);
    if (!trackPresent) {
      throw new NotFoundException(`No track with ID: ${trackId} not found.`);
    }

    this.databaseService.tracks.delete(trackId);

    const isFavTrack = this.databaseService.favorites.favExists(
      trackId,
      'tracks',
    );
    if (isFavTrack) {
      this.databaseService.favorites.deleteFav(trackId, 'tracks');
    }
  }
}
