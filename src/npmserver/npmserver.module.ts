import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NpmserverService } from './npmserver.service';
import { NpmserverController } from './npmserver.controller';

@Module({
  imports: [HttpModule],
  controllers: [NpmserverController],
  providers: [NpmserverService]
})
export class NpmserverModule {}
