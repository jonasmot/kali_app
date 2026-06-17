import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Usuario } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({ where: { email } });
  }

  async criar(data: Prisma.UsuarioCreateInput): Promise<Usuario> {
    const saltRounds = 10;
    const senhaHasheada = await bcrypt.hash(data.senha, saltRounds);
    
    return this.prisma.usuario.create({
      data: {
        ...data,
        senha: senhaHasheada,
      },
    });
  }
}
