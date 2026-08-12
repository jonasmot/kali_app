import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsArray, ValidateNested, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTreinoExercicioDto {
  @ApiProperty({ example: 1, description: 'Exercise ID' })
  @IsNumber()
  exercicio_id: number;

  @ApiPropertyOptional({ example: 1, description: 'Order in the workout' })
  @IsOptional()
  @IsNumber()
  ordem?: number;

  @ApiPropertyOptional({ example: 3, description: 'Number of sets' })
  @IsOptional()
  @IsNumber()
  series?: number;

  @ApiPropertyOptional({ example: 12, description: 'Number of reps per set' })
  @IsOptional()
  @IsNumber()
  repeticoes?: number;
}

export class CreateTreinoDto {
  @ApiProperty({ example: 'Treino A - Peito', description: 'Workout name' })
  @IsString()
  nome: string;

  @ApiPropertyOptional({ example: 'Treino focado em hipertrofia do peitoral', description: 'Workout description' })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ type: [CreateTreinoExercicioDto], description: 'List of exercises in the workout' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTreinoExercicioDto)
  exercicios: CreateTreinoExercicioDto[];
}
