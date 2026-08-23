import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExerciciosService {
  constructor(private prisma: PrismaService) {}

  /**
   * Retrieves all exercises, optionally filtering by a specific muscle group.
   * @param grupoMuscular Optional muscle group filter.
   * @returns Array of exercises.
   */
  async findAll(grupoMuscular?: string) {
    return this.prisma.exercicio.findMany({
      where: grupoMuscular ? { grupo_muscular: grupoMuscular } : undefined,
    });
  }

  /**
   * Retrieves a single exercise by ID.
   * @param id The ID of the exercise.
   * @returns The exercise object.
   */
  async findOne(id: number) {
    const exercicio = await this.prisma.exercicio.findUnique({ where: { id } });
    if (!exercicio) {
      throw new NotFoundException(`Exercício com id ${id} não encontrado`);
    }
    return exercicio;
  }

}
