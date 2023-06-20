import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Log } from '@prisma/client';

@Injectable()
export class LogsService {
  constructor(private service: PrismaService) {}

  async createLog(data: any): Promise<any> {
    return this.service.log.create({ data });
  }
}
