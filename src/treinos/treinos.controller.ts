import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TreinosService } from './treinos.service';
import { CreateTreinoDto } from './dto/create-treino.dto';
import { UpdateTreinoDto, UpdateTreinoExercicioDto } from './dto/update-treino.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { CurrentUserDto } from '../common/decorators/current-user.decorator';

@ApiTags('treinos')
@ApiBearerAuth()
@Controller('treinos')
export class TreinosController {
  constructor(private readonly treinosService: TreinosService) {}

  /**
   * Retrieves all workouts for the current user.
   */
  @Get()
  @ApiOperation({ summary: 'Get all user workouts' })
  @ApiResponse({ status: 200, description: 'Return all workouts for the current user.' })
  findAll(@CurrentUser() user: CurrentUserDto) {
    return this.treinosService.findAll(user.id);
  }

  /**
   * Retrieves a specific workout by ID, verifying ownership.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a specific workout by id' })
  @ApiResponse({ status: 200, description: 'Return the workout.' })
  @ApiResponse({ status: 404, description: 'Workout not found.' })
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: CurrentUserDto) {
    return this.treinosService.findOne(id, user.id);
  }

  /**
   * Creates a new workout for the current user.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new workout' })
  @ApiResponse({ status: 201, description: 'The workout has been successfully created.' })
  create(@Body() createTreinoDto: CreateTreinoDto, @CurrentUser() user: CurrentUserDto) {
    return this.treinosService.create(createTreinoDto, user.id);
  }

  /**
   * Updates an existing workout by ID (e.g., changes its name).
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update a workout' })
  @ApiResponse({ status: 200, description: 'The workout has been successfully updated.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTreinoDto: UpdateTreinoDto, @CurrentUser() user: CurrentUserDto) {
    return this.treinosService.update(id, updateTreinoDto, user.id);
  }

  /**
   * Updates specific exercise details within a workout.
   */
  @Patch(':id/exercicios/:exercicioId')
  @ApiOperation({ summary: 'Update an exercise within a workout (e.g., toggle completion)' })
  @ApiResponse({ status: 200, description: 'The workout exercise has been successfully updated.' })
  updateExercicio(
    @Param('id', ParseIntPipe) treinoId: number,
    @Param('exercicioId', ParseIntPipe) exercicioId: number,
    @Body() updateTreinoExercicioDto: UpdateTreinoExercicioDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.treinosService.updateExercicio(treinoId, exercicioId, updateTreinoExercicioDto, user.id);
  }

  /**
   * Deletes a workout by ID.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a workout' })
  @ApiResponse({ status: 200, description: 'The workout has been successfully deleted.' })
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: CurrentUserDto) {
    return this.treinosService.remove(id, user.id);
  }
}
