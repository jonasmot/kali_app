import { ApiProperty } from '@nestjs/swagger';

export class CreateTreinoDto {
  @ApiProperty({ example: 'Treino de Força - Foco no Muscle-up' })
  nome!: string;

  @ApiProperty({ example: 'Puxada / Altas Repetições' })
  categoria!: string;

  @ApiProperty({ required: false, example: [{ id: '1', concluido: false }] })
  exercicios?: any;
}