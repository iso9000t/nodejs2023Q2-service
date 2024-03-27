import { IsBoolean, IsString, IsNotEmpty } from 'class-validator';

export class CreateArtistDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsBoolean()
  @IsNotEmpty()
  grammy: boolean;
}
