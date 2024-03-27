import { plainToClass } from 'class-transformer';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Artist } from './entities/artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistService {
  constructor(private prismaService: PrismaService) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const artist = await this.prismaService.artist.create({
      data: createArtistDto,
    });
    return plainToClass(Artist, artist);
  }

  async findAll(): Promise<Artist[]> {
    const allArtists = await this.prismaService.artist.findMany();
    return allArtists.map((artist: Artist) => plainToClass(Artist, artist));
  }

  async findOne(artistId: string): Promise<Artist> {
    const artist = await this.prismaService.artist.findUnique({
      where: { id: artistId },
    });
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${artistId} not found`);
    }
    return plainToClass(Artist, artist);
  }

  async update(artistId: string, artistData: UpdateArtistDto): Promise<Artist> {
    const existingArtist = await this.prismaService.artist.findUnique({
      where: { id: artistId },
    });
    if (!existingArtist) {
      throw new NotFoundException(
        `Failed to locate artist with ID ${artistId}.`,
      );
    }

    const updatedArtist = await this.prismaService.artist.update({
      where: { id: artistId },
      data: artistData,
    });

    return plainToClass(Artist, updatedArtist);
  }

  async delete(artistId: string): Promise<void> {
    await this.prismaService.artist
      .delete({
        where: { id: artistId },
      })
      .catch((error) => {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            `Artist ID ${artistId} not found for deletion.`,
          );
        }
        throw error;
      });
  }
}
