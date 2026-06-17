import { ApiProperty } from '@nestjs/swagger';

export class RegisterAuthDto {
  @ApiProperty({ example: 'Jonas' })
  name!: string;

  @ApiProperty({ example: 'teste@email.com' })
  email!: string;

  @ApiProperty({ example: 'senha123' })
  senha!: string;
}
