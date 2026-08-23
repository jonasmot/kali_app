import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ExerciciosService } from './exercicios.service';

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

}
