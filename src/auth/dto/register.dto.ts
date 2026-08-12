import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsNumber, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @IsString()
  @MinLength(2)
  nome: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @MinLength(6)
  senha: string;

  @ApiProperty({ example: 1, description: 'Profile type (1: Aluno, 2: Professor, 3: Admin)' })
  @IsOptional()
  @IsNumber()
  tipo_perfil_id?: number;
}
