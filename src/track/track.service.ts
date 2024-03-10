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
    const trackToAdd: Track = Object.assign({}, trackData, {
      id: trackId,
      artistId: null,
      albumId: null,
    });

    this.databaseService.tracks.add(trackId, trackToAdd);
    return trackToAdd;
  }

  findAll(): Track[] {
    return this.databaseService.tracks.fetchAll();
  }

  findOne(trackId: string): Track {
    const track = this.databaseService.tracks.find(trackId);
    if (!track) {
      throw new NotFoundException(
        `Track with ID ${trackId} could not be located.`,
      );
    }
    return track;
  }

  update(trackId: string, updateTrackDto: UpdateTrackDto): Track {
    if (!trackId) {
      throw new NotFoundException(`Track ${trackId} not found`);
    }
    const track = this.findOne(trackId);
    const updatedTrack = { ...track, ...updateTrackDto };

    this.databaseService.tracks.add(trackId, updatedTrack);
    return updatedTrack;
  }

  remove(trackId: string): void {
    this.findOne(trackId);
    this.databaseService.tracks.delete(trackId);
  }
}
