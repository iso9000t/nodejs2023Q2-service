import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto): Album {
    return this.albumService.create(createAlbumDto);
  }

  @Get()
  findAll(): Album[] {
    return this.albumService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Album {
    return this.albumService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ): Album {
    return this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): void {
    this.albumService.remove(id);
  }
}
