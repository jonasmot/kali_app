import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Healthcheck endpoint.
   */
  @Public()
  @Get()
  @ApiOperation({ summary: 'Healthcheck endpoint' })
  @ApiResponse({ status: 200, description: 'Returns system status' })
  getHealthCheck() {
    return this.appService.getHealthCheck();
  }
}
