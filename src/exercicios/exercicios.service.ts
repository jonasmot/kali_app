import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExercicioDto } from './dto/create-exercicio.dto';
import { UpdateExercicioDto } from './dto/update-exercicio.dto';

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

  /**
   * Creates a new exercise.
   * @param data The data to create the exercise.
   * @returns The created exercise.
   */
  async create(data: CreateExercicioDto) {
    return this.prisma.exercicio.create({ data });
  }

  /**
   * Updates an existing exercise.
   * @param id The ID of the exercise to update.
   * @param data The data to update.
   * @returns The updated exercise.
   */
  async update(id: number, data: UpdateExercicioDto) {
    await this.findOne(id); // Check existence
    return this.prisma.exercicio.update({
      where: { id },
      data,
    });
  }

  /**
   * Deletes an exercise.
   * @param id The ID of the exercise to delete.
   * @returns The deleted exercise.
   */
  async remove(id: number) {
    await this.findOne(id); // Check existence
    return this.prisma.exercicio.delete({
      where: { id },
    });
  }
}
