import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ExerciciosService } from './exercicios.service';
import { CreateExercicioDto } from './dto/create-exercicio.dto';
import { UpdateExercicioDto } from './dto/update-exercicio.dto';

@ApiTags('exercicios')
@ApiBearerAuth()
@Controller('exercicios')
export class ExerciciosController {
  constructor(private readonly exerciciosService: ExerciciosService) {}

  /**
   * Retrieves all exercises, optionally filtered by muscle group.
   */
  @Get()
  @ApiOperation({ summary: 'Get all exercises' })
  @ApiQuery({ name: 'grupo_muscular', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Return all exercises.' })
  findAll(@Query('grupo_muscular') grupoMuscular?: string) {
    return this.exerciciosService.findAll(grupoMuscular);
  }

  /**
   * Retrieves an exercise by ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get an exercise by id' })
  @ApiResponse({ status: 200, description: 'Return the exercise.' })
  @ApiResponse({ status: 404, description: 'Exercise not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.exerciciosService.findOne(id);
  }

  /**
   * Creates a new exercise.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new exercise' })
  @ApiResponse({ status: 201, description: 'The exercise has been successfully created.' })
  create(@Body() createExercicioDto: CreateExercicioDto) {
    return this.exerciciosService.create(createExercicioDto);
  }

  /**
   * Updates an exercise by ID.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update an exercise' })
  @ApiResponse({ status: 200, description: 'The exercise has been successfully updated.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateExercicioDto: UpdateExercicioDto) {
    return this.exerciciosService.update(id, updateExercicioDto);
  }

  /**
   * Deletes an exercise by ID.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an exercise' })
  @ApiResponse({ status: 200, description: 'The exercise has been successfully deleted.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.exerciciosService.remove(id);
  }
}
