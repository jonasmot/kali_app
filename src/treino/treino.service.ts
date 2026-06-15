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
      },
    });
    return novoTreino;
  }

  async findAll() {
    // Busca todos os treinos cadastrados
    return this.prisma.treino.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} treino`;
  }

  update(id: number, updateTreinoDto: UpdateTreinoDto) {
    return `This action updates a #${id} treino`;
  }

  remove(id: number) {
    return `This action removes a #${id} treino`;
  }
}
