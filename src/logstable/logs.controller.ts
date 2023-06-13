import { Body, Controller, Post } from '@nestjs/common';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post('log')
  async createLog(@Body() data: any): Promise<any> {
    return this.logsService.createLog(data);
  }
}