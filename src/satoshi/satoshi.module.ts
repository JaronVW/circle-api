import { Module } from '@nestjs/common';
import { SatoshiService } from './satoshi.service';
import { SatoshiController } from './satoshi.controller';
import { PrismaService } from 'src/prisma.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [SatoshiController],
  imports: [HttpModule],
  providers: [SatoshiService, PrismaService]
})
export class SatoshiModule {}
