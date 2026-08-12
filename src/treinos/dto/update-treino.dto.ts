import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateTreinoDto } from './create-treino.dto';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTreinoDto extends PartialType(CreateTreinoDto) {}

export class UpdateTreinoExercicioDto {
  @ApiPropertyOptional({ example: true, description: 'Whether the exercise is completed' })
  @IsOptional()
  @IsBoolean()
  concluido?: boolean;

  @ApiPropertyOptional({ example: 4, description: 'Number of sets' })
  @IsOptional()
  @IsNumber()
  series?: number;

  @ApiPropertyOptional({ example: 10, description: 'Number of reps' })
  @IsOptional()
  @IsNumber()
  repeticoes?: number;
}
