import {
  WebSocketGateway,
  MessageBody,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { MessageDto } from './message.dto';
import { WsGuard } from 'src/auth/ws.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  constructor(private service: ChatService) {}

  @WebSocketServer()
  server: Server;

  @UseGuards(WsGuard)
  @SubscribeMessage('chat')
  async joinStream(
    @MessageBody() connParams: { streamerID: string; userID: number },
    @ConnectedSocket() socket: Socket,
  ) {
    socket.join(connParams.streamerID);
    socket.on(connParams.streamerID, async (message: MessageDto) => {
      message.datetime = new Date();
      this.server
        .to(connParams.streamerID)
        .emit(connParams.streamerID, message);
      await this.service.PostMessage(
        message.message,
        connParams.streamerID,
        connParams.userID,
      );
    });
  }
}
