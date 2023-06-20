import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LogsService } from './logs.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PrismaService } from 'src/prisma.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService, private readonly prismaService: PrismaService) {}

  @Post('log')
  @UseGuards(JwtAuthGuard)
  async createLog(@Body() data: any): Promise<any> {
    if (data.UserID && data.LogText) {
      return this.prismaService.$transaction(async (prisma) => {
        return prisma.log.create({ data });
      });
    }
    return new Error('The log was of the wrong type!');
  }
}