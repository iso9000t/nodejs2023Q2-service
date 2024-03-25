import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Track } from './entities/track.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { plainToClass } from 'class-transformer';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class TrackService {
  constructor(private prismaService: PrismaService) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const newTrack = await this.prismaService.track.create({
      data: createTrackDto,
    });
    return plainToClass(Track, newTrack);
  }

  async findAll(): Promise<Track[]> {
    const tracks = await this.prismaService.track.findMany();
    return tracks.map((track: Track) => plainToClass(Track, track));
  }

  async findOne(trackId: string): Promise<Track> {
    try {
      const track = await this.prismaService.track.findUnique({
        where: { id: trackId },
      });
      if (!track) throw new Error('Track not found');
      return plainToClass(Track, track);
    } catch (error) {
      throw new NotFoundException(`Track with ID ${trackId} not found`);
    }
  }

  async update(
    trackId: string,
    updateTrackDto: UpdateTrackDto,
  ): Promise<Track> {
    const trackToUpdate = await this.prismaService.track.findUnique({
      where: { id: trackId },
    });
    if (!trackToUpdate) {
      throw new NotFoundException(`Track with ID ${trackId} not found`);
    }
    const updatedTrack = await this.prismaService.track.update({
      where: { id: trackId },
      data: updateTrackDto,
    });
    return plainToClass(Track, updatedTrack);
  }

  async delete(trackId: string): Promise<void> {
    await this.prismaService.track
      .delete({
        where: { id: trackId },
      })
      .catch((error: unknown) => {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2025'
        ) {
          throw new NotFoundException(`Track with ID ${trackId} not found`);
        }
        throw error;
      });
  }
}
