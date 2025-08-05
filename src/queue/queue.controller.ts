import { Controller, Get } from '@nestjs/common';
import { RabbyService } from '../rabbit/rabby.service';

@Controller('queue')
export class QueueController {
  constructor(private readonly rabbyService: RabbyService) {}

  @Get('stats')
  async getStats() {
    return await this.rabbyService.getAllQueuesStats();
  }
}