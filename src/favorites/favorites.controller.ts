import { FavoritesService } from './favorites.service';
import { FavoritesResponseDto } from './dto/favorites-response.dto';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Post,
  Param,
} from '@nestjs/common';

@Controller('favs')
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  findAll(): FavoritesResponseDto {
    return this.favoritesService.findAll();
  }

  @Post('track/:id')
  addTrack(@Param('id', ParseUUIDPipe) id: string): void {
    this.favoritesService.add(id, 'tracks');
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTrack(@Param('id', ParseUUIDPipe) id: string): void {
    this.favoritesService.remove(id, 'tracks');
  }

  @Post('album/:id')
  addAlbum(@Param('id', ParseUUIDPipe) id: string): void {
    this.favoritesService.add(id, 'albums');
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAlbum(@Param('id', ParseUUIDPipe) id: string): void {
    this.favoritesService.remove(id, 'albums');
  }

  @Post('artist/:id')
  addArtist(@Param('id', ParseUUIDPipe) id: string): void {
    this.favoritesService.add(id, 'artists');
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeArtist(@Param('id', ParseUUIDPipe) id: string): void {
    this.favoritesService.remove(id, 'artists');
  }
}
