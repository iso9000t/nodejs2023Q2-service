import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AlbumModule } from './album/album.module';
import { UserModule } from './user/user.module';
import { FavoritesModule } from './favorites/favorites.module';
import { TrackModule } from './track/track.module';
import { ArtistModule } from './artist/artist.module';

@Module({
  imports: [
    UserModule,
    TrackModule,
    FavoritesModule,
    ArtistModule,
    AlbumModule,
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
