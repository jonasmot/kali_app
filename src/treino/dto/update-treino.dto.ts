import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateTreinoDto } from './create-treino.dto';

export class UpdateTreinoDto extends PartialType(CreateTreinoDto) {
  @ApiProperty({ required: false })
  exercicios?: any;
}
