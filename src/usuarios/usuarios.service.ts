import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from '../auth/dto/register.dto';
import * as bcrypt from 'bcrypt';
import { Usuario } from '@prisma/client';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  /**
   * Finds a user by email.
   * @param email The email to search for.
   * @returns The user object.
   */
  async buscarPorEmail(email: string): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({ where: { email } });
  }

  /**
   * Finds a user by ID.
   * @param id The ID to search for.
   * @returns The user object.
   */
  async buscarPorId(id: number): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({ where: { id } });
  }

  /**
   * Creates a new user.
   * @param data The user data.
   * @returns The created user object.
   */
  async criar(data: RegisterDto): Promise<Usuario> {
    const existente = await this.buscarPorEmail(data.email);
    if (existente) {
      throw new ConflictException('Email já está em uso');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.senha, saltRounds);

    return this.prisma.usuario.create({
      data: {
        ...data,
        senha: hashedPassword,
      },
    });
  }
}
