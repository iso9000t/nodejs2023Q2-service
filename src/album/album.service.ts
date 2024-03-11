import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { plainToClass } from 'class-transformer';
import { Album } from './entities/album.entity';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { DatabaseService } from '../database/database.service';
import { CreateAlbumDto } from './dto/create-album.dto';

@Injectable()
export class AlbumService {
  constructor(private readonly dbService: DatabaseService) {}

  create(createAlbumDto: CreateAlbumDto): Album {
    const albumId = uuidv4();
    const album = plainToClass(Album, {
      id: albumId,
      ...createAlbumDto,
      artistId: createAlbumDto.artistId ?? null,
    });

    this.dbService.albums.add(albumId, album);
    return album;
  }

  findAll(): Album[] {
    return this.dbService.albums.fetchAll();
  }

  findOne(albumId: string): Album {
    const album = this.dbService.albums.getOne(albumId);
    if (!album) {
      throw new NotFoundException(
        `Could not find any album with ID ${albumId}`,
      );
    }
    return album;
  }

  update(albumId: string, updateAlbumDto: UpdateAlbumDto): Album {
    this.ensureAlbumExists(albumId);
    const updatedAlbum = plainToClass(Album, {
      ...this.findOne(albumId),
      ...updateAlbumDto,
    });

    this.dbService.albums.add(albumId, updatedAlbum);
    return updatedAlbum;
  }

  remove(albumId: string): void {
    this.ensureAlbumExists(albumId);
    this.dbService.albums.delete(albumId);
    this.detachAlbumFromTracks(albumId);
    this.dbService.favorites.deleteFav(albumId, 'albums');
  }

  private ensureAlbumExists(albumId: string): void {
    if (!this.dbService.albums.exists(albumId)) {
      throw new NotFoundException(`No album found with ID ${albumId}`);
    }
  }

  private detachAlbumFromTracks(albumId: string): void {
    const tracks = this.dbService.tracks.fetchAll();
    const tracksToUpdate = tracks.filter((track) => track.albumId === albumId);

    tracksToUpdate.forEach((track) => {
      this.dbService.tracks.add(track.id, { ...track, albumId: null });
    });
  }
}
