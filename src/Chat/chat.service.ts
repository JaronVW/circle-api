import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { MessageDto } from './message.dto';
import { LogsService } from 'src/logstable/logs.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService, private readonly logService: LogsService) {}

  async PostMessage(message: string, streamID: string, userID: number) {
    this.logService.createLog({
      UserID: userID,
      LogText:
        'User ' +
        userID +
        ' commented ' + message + ' on ' +
        new Date().toLocaleString(),
    });
    return await this.prisma.message.create({
      data: {
        StreamID: streamID,
        UserID: userID,
        Message: message,
      },
    });
  }
}
