import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { MessageDto } from './message.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  PostMessage(message: MessageDto) {
    return this.prisma.message.create({
      data: {
        StreamID: uuidv4(),
        UserID: 1,
        Message: message.message,
      },
    });
  }
}
