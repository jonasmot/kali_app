import { Injectable } from '@nestjs/common';
import { CreateTreinoDto } from './dto/create-treino.dto';
import { UpdateTreinoDto } from './dto/update-treino.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TreinoService {
  // Injetamos o Prisma aqui no construtor
  constructor(private prisma: PrismaService) {}

  async create(createTreinoDto: CreateTreinoDto) {
    // Salva o treino no PostgreSQL
    const novoTreino = await this.prisma.treino.create({
      data: {
        nome: createTreinoDto.nome,
        categoria: createTreinoDto.categoria,
        exercicios: createTreinoDto.exercicios ?? null,
      },
    });
    return novoTreino;
  }

  async findAll() {
    // Busca todos os treinos cadastrados ordenados do mais novo
    return this.prisma.treino.findMany({ orderBy: { data_criacao: 'desc' } });
  }

  findOne(id: number) {
    return `This action returns a #${id} treino`;
  }

  async update(id: number, updateTreinoDto: UpdateTreinoDto) {
    return this.prisma.treino.update({
      where: { id },
      data: {
        ...(updateTreinoDto.nome !== undefined && { nome: updateTreinoDto.nome }),
        ...(updateTreinoDto.categoria !== undefined && { categoria: updateTreinoDto.categoria }),
        ...(updateTreinoDto.exercicios !== undefined && { exercicios: updateTreinoDto.exercicios })
      }
    });
  }

  async remove(id: number) {
    return this.prisma.treino.delete({ where: { id } });
  }
}
