/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './Chat/chat.module';
import { NpmserverService } from './npmserver/npmserver.service';
import { NpmserverModule } from './npmserver/npmserver.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { LogsModule } from './logstable/logs.module';
import { SatoshiModule } from './satoshi/satoshi.module';


@Module({
  imports: [AuthModule, UsersModule, ChatModule, NpmserverModule, HttpModule, ConfigModule.forRoot(), LogsModule, SatoshiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
