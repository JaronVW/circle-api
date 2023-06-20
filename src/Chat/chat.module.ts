import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { PrismaService } from 'src/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { LogsService } from 'src/logstable/logs.service';

@Module({
  imports: [AuthModule],
  providers: [ChatService, ChatGateway, PrismaService, LogsService],
})
export class ChatModule {}
