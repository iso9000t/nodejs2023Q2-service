import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';

@Controller('track')
export class TrackController {
  constructor(private readonly service: TrackService) {}

  @Post()
  createTrack(@Body() createDto: CreateTrackDto): Track {
    return this.service.create(createDto);
  }

  @Get()
  getAllTracks(): Track[] {
    return this.service.findAll();
  }

  @Get(':id')
  getTrack(@Param('id', ParseUUIDPipe) uuid: string): Track {
    return this.service.findOne(uuid);
  }

  @Put(':id')
  updateTrack(
    @Param('id', ParseUUIDPipe) uuid: string,
    @Body() updateDto: UpdateTrackDto,
  ): Track {
    return this.service.update(uuid, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTrack(@Param('id', ParseUUIDPipe) uuid: string): void {
    this.service.remove(uuid);
  }
}
