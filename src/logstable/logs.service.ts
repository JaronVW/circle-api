import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class LogsService {
    constructor(private service: PrismaService) {}

    async createLog(data: any): Promise<any> {
        //userid ook meegeven
        return this.service.log.create({ data });
    }
}
