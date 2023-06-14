import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NpmserverService } from './npmserver.service';
import { NpmserverController } from './npmserver.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [HttpModule],
  controllers: [NpmserverController],
  providers: [NpmserverService, PrismaService],
})
export class NpmserverModule {}
