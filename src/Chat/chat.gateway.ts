import {
  WebSocketGateway,
  MessageBody,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { AuthUser } from 'src/auth.decorator';
import { JWTDecodedUser } from 'src/jwt.decoded.user';
import * as child from 'child_process';
import { UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { MessageDto } from './message.dto';
import { WsGuard } from 'src/auth/ws.guard';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  constructor(private service: ChatService) {}

  @WebSocketServer()
  server: Server;

  @UseGuards(WsGuard)
  @SubscribeMessage('chat')
  async joinStream(
    @MessageBody() streamId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.join(streamId);
    socket.on(streamId, (message: MessageDto) => {
      console.log('message', message);
      message.datetime = new Date();
      this.server.to(streamId).emit(streamId, message);
      // return message;
      // this.service.PostMessage({
      //   message: message,
      //   userId: user.userId,
      //   streamId: streamId,
      // });
    });
  }
}
