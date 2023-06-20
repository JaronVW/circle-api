import { Module } from '@nestjs/common';
import { SatoshiService } from './satoshi.service';
import { SatoshiController } from './satoshi.controller';
import { PrismaService } from 'src/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { DoublingService } from './doubling.service';
import { ConfigModule } from '@nestjs/config';
import { VideoService } from './videowatcher.service';
import { LogsService } from 'src/logstable/logs.service';

@Module({
  controllers: [SatoshiController],
  imports: [HttpModule, ConfigModule],
  providers: [SatoshiService, PrismaService, DoublingService, VideoService, LogsService]
})
export class SatoshiModule {}
