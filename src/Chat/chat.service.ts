import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { LogsService } from 'src/logstable/logs.service';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private readonly logService: LogsService,
  ) {}

  async PostMessage(message: string, streamerID: string, userID: number) {
    this.logService.createLog({
      UserID: userID,
      LogText:
        'User ' +
        userID +
        ' commented ' +
        message +
        ' on ' +
        new Date().toLocaleString(),
    });
    return await this.prisma.message.create({
      data: {
        StreamID: streamerID,
        UserID: userID,
        Message: message,
      },
    });
  }
}
