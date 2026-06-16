import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthDto {
  @ApiProperty({ example: 'teste@email.com' })
  email!: string;

  @ApiProperty({ example: 'senha123' })
  senha!: string;
}
