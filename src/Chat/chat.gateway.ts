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

@WebSocketGateway({ cors: true })
export class ChatGateway {
  constructor(private service: ChatService) {}

  @WebSocketServer()
  server: Server;

  @UseGuards()
  @SubscribeMessage('chat')
  async joinStream(
    @MessageBody() streamId: string,
    @ConnectedSocket() socket: Socket,
    @AuthUser() user: JWTDecodedUser,
  ) {
    // console.log('joinStream', streamId);
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
