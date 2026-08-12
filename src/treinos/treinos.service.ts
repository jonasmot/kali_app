import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTreinoDto } from './dto/create-treino.dto';
import { UpdateTreinoDto, UpdateTreinoExercicioDto } from './dto/update-treino.dto';

@Injectable()
export class TreinosService {
  constructor(private prisma: PrismaService) {}

  /**
   * Retrieves all workouts for a specific user, including exercises.
   * @param usuarioId The ID of the user.
   * @returns Array of workouts.
   */
  async findAll(usuarioId: number) {
    return this.prisma.treino.findMany({
      where: { usuario_id: usuarioId },
      include: {
        exercicios: {
          include: { exercicio: true },
          orderBy: { ordem: 'asc' },
        },
      },
    });
  }

  /**
   * Retrieves a single workout by ID and verifies ownership.
   * @param id The workout ID.
   * @param usuarioId The ID of the user.
   * @returns The workout object.
   */
  async findOne(id: number, usuarioId: number) {
    const treino = await this.prisma.treino.findUnique({
      where: { id },
      include: {
        exercicios: {
          include: { exercicio: true },
          orderBy: { ordem: 'asc' },
        },
      },
    });

    if (!treino) {
      throw new NotFoundException(`Treino com id ${id} não encontrado`);
    }

    if (treino.usuario_id !== usuarioId) {
      throw new ForbiddenException('Você não tem acesso a este treino');
    }

    return treino;
  }

  /**
   * Creates a new workout with exercises for a user.
   * @param data The data to create the workout.
   * @param usuarioId The ID of the user creating the workout.
   * @returns The created workout.
   */
  async create(data: CreateTreinoDto, usuarioId: number) {
    return this.prisma.treino.create({
      data: {
        nome: data.nome,
        descricao: data.descricao,
        usuario_id: usuarioId,
        exercicios: {
          create: data.exercicios.map((ex) => ({
            exercicio_id: ex.exercicio_id,
            ordem: ex.ordem ?? 0,
            series: ex.series,
            repeticoes: ex.repeticoes,
          })),
        },
      },
      include: {
        exercicios: true,
      },
    });
  }

  /**
   * Updates a workout's general details.
   * @param id The workout ID.
   * @param data The data to update.
   * @param usuarioId The user ID to verify ownership.
   * @returns The updated workout.
   */
  async update(id: number, data: UpdateTreinoDto, usuarioId: number) {
    await this.findOne(id, usuarioId); // verify ownership and existence

    return this.prisma.treino.update({
      where: { id },
      data: {
        nome: data.nome,
        descricao: data.descricao,
      },
    });
  }

  /**
   * Updates an exercise within a workout.
   * @param treinoId The workout ID.
   * @param exercicioId The exercise ID within the workout.
   * @param data The data to update (e.g., concluido status).
   * @param usuarioId The user ID to verify ownership.
   * @returns The updated TreinoExercicio.
   */
  async updateExercicio(treinoId: number, exercicioId: number, data: UpdateTreinoExercicioDto, usuarioId: number) {
    await this.findOne(treinoId, usuarioId); // verify ownership and existence

    return this.prisma.treinoExercicio.update({
      where: {
        treino_id_exercicio_id: {
          treino_id: treinoId,
          exercicio_id: exercicioId,
        },
      },
      data,
    });
  }

  /**
   * Deletes a workout.
   * @param id The workout ID.
   * @param usuarioId The user ID to verify ownership.
   * @returns The deleted workout.
   */
  async remove(id: number, usuarioId: number) {
    await this.findOne(id, usuarioId); // verify ownership and existence

    return this.prisma.treino.delete({
      where: { id },
    });
  }
}
