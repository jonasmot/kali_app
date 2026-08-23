import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsNumber, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @IsString({ message: 'O nome é obrigatório.' })
  @MinLength(2, { message: 'O nome deve ter no mínimo 2 caracteres.' })
  nome: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail({}, { message: 'E-mail inválido. Verifique se você digitou corretamente.' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString({ message: 'A senha é obrigatória.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 dígitos.' })
  senha: string;
}
