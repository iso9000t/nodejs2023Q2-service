import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  albumId: string | null;

  @IsString()
  @IsOptional()
  artistId: string | null;

  @IsNumber()
  @IsNotEmpty()
  duration: number;
}
