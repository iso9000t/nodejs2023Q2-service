import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Album } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { PrismaService } from '../database/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
@Injectable()
export class AlbumService {
  constructor(private prismaService: PrismaService) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const album = await this.prismaService.album.create({
      data: createAlbumDto,
    });
    return plainToClass(Album, album);
  }

  async findAll(): Promise<Album[]> {
    const allAlbums = await this.prismaService.album.findMany();
    return allAlbums.map((album: Album) => plainToClass(Album, album));
  }

  async findOne(albumId: string): Promise<Album> {
    const album = await this.prismaService.album.findUnique({
      where: { id: albumId },
    });
    if (!album) {
      throw new NotFoundException(`No album found with ID ${albumId}`);
    }
    return plainToClass(Album, album);
  }

  async update(
    albumId: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album> {
    const updatedAlbum = await this.prismaService.album
      .update({
        where: { id: albumId },
        data: updateAlbumDto,
      })
      .catch((error: unknown) => {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2025'
        ) {
          throw new NotFoundException(`Album with ID ${albumId} not found`);
        }
        throw error;
      });

    return plainToClass(Album, updatedAlbum);
  }

  async delete(albumId: string): Promise<void> {
    await this.prismaService.album
      .delete({
        where: { id: albumId },
      })
      .catch((error: unknown) => {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === 'P2025'
        ) {
          throw new NotFoundException(
            `Failed to find album with ID ${albumId} for deletion`,
          );
        }
        throw error;
      });
  }
}
