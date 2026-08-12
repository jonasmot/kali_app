import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateExercicioDto {
  @ApiProperty({ example: 'Flexão', description: 'Title of the exercise' })
  @IsString()
  titulo: string;

  @ApiPropertyOptional({ example: 'Push up exercise', description: 'Description of the exercise' })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ example: 'Peito', description: 'Target muscle group' })
  @IsString()
  grupo_muscular: string;

  @ApiPropertyOptional({ example: 'https://youtube.com/...', description: 'URL for video tutorial' })
  @IsOptional()
  @IsString()
  video_url?: string;
}
