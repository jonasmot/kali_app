import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Returns system health status.
   */
  getHealthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
