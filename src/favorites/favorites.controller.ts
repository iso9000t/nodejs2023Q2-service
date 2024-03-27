import {
  Controller,
  Delete,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  Post,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesResponseDto } from './dto/favorites-response.dto';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async findAll(): Promise<FavoritesResponseDto> {
    return this.favoritesService.findAll();
  }

  @Post(':type/:id')
  async addItem(
    @Param('type') type: 'album' | 'artist' | 'track',
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.favoritesService[
      `add${type.charAt(0).toUpperCase() + type.slice(1)}`
    ](id);
  }

  @Delete(':type/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeItem(
    @Param('type') type: 'album' | 'artist' | 'track',
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.favoritesService[
      `remove${type.charAt(0).toUpperCase() + type.slice(1)}`
    ](id);
  }
}
