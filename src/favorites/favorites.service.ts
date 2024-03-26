import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { FavoritesResponseDto } from './dto/favorites-response.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class FavoritesService {
  constructor(private prismaService: PrismaService) {}

  async findAll(): Promise<FavoritesResponseDto> {
    const favorites = await Promise.all([
      this.prismaService.favoriteArtist.findMany({ select: { artist: true } }),
      this.prismaService.favoriteAlbum.findMany({ select: { album: true } }),
      this.prismaService.favoriteTrack.findMany({ select: { track: true } }),
    ]);

    return {
      artists: favorites[0].map((a) => a.artist),
      albums: favorites[1].map((a) => a.album),
      tracks: favorites[2].map((t) => t.track),
    };
  }

  private handleError(err: any, id: string): { message: string } | never {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === 'P2003') {
        throw new UnprocessableEntityException(`Item with ID ${id} not found.`);
      }
      if (err.code === 'P2002') {
        return { message: 'Item already exists in favorites.' };
      }
    }
    throw err;
  }

  async add(
    type: 'album' | 'artist' | 'track',
    id: string,
  ): Promise<{ message: string }> {
    const types = {
      album: 'favoriteAlbum',
      artist: 'favoriteArtist',
      track: 'favoriteTrack',
    };
    const typeName = `${
      type.charAt(0).toUpperCase() + type.slice(1)
    } added to favorites.`;

    try {
      await this.prismaService[types[type]].create({
        data: { [`${type}Id`]: id },
      });
      return { message: typeName };
    } catch (err) {
      return this.handleError(err, id);
    }
  }

  async addAlbum(id: string): Promise<{ message: string }> {
    return this.add('album', id);
  }

  async addArtist(id: string): Promise<{ message: string }> {
    return this.add('artist', id);
  }

  async addTrack(id: string): Promise<{ message: string }> {
    return this.add('track', id);
  }

  async remove(
    type: 'album' | 'artist' | 'track',
    id: string,
  ): Promise<{ message: string }> {
    const types = {
      album: 'favoriteAlbum',
      artist: 'favoriteArtist',
      track: 'favoriteTrack',
    };
    const typeName = `${
      type.charAt(0).toUpperCase() + type.slice(1)
    } removed from favorites.`;

    try {
      await this.prismaService[types[type]].delete({
        where: { [`${type}Id`]: id },
      });
      return { message: typeName };
    } catch (err) {
      return this.handleError(err, id);
    }
  }

  async removeAlbum(id: string): Promise<{ message: string }> {
    return this.remove('album', id);
  }

  async removeArtist(id: string): Promise<{ message: string }> {
    return this.remove('artist', id);
  }

  async removeTrack(id: string): Promise<{ message: string }> {
    return this.remove('track', id);
  }
}
