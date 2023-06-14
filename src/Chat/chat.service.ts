import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { MessageDto } from './message.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async PostMessage(message: string, streamID: string, userID: number) {
    return await this.prisma.message.create({
      data: {
        StreamerID: streamID,
        UserID: userID,
        Message: message,
      },
    });
  }
}
