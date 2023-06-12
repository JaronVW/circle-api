/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './Chat/chat.module';
import { NmserverService } from './nmserver/nmserver.service';
import { NpmserverModule } from './npmserver/npmserver.module';
import { NpmserverModule } from './npmserver/npmserver.module';

@Module({
  imports: [AuthModule, UsersModule, ChatModule, NpmserverModule],
  controllers: [AppController],
  providers: [AppService, NmserverService],
})
export class AppModule {}
