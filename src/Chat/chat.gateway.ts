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
import { MD5 } from 'crypto-js';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  constructor(private service: ChatService) { }

  @WebSocketServer()
  server: Server;

  // @UseGuards(WsGuard)
  @SubscribeMessage('chatchecksum')
  async joinStream(
    @MessageBody()
    connParams: { streamerID: string; userID: number; checksum: string },
    @ConnectedSocket() socket: Socket,
  ) {
    if (
      connParams.checksum ==
      MD5(
        JSON.stringify({
          streamerID: connParams.streamerID,
          userID: connParams.userID,
        }),
      ).toString()
    ) {
      console.log('joined');
      socket.join(connParams.streamerID);
      socket.on(connParams.streamerID, async (message: MessageDto) => {
        message.datetime = new Date();
        this.server
          .to(connParams.streamerID)
          .emit(connParams.streamerID, message);
        // await this.service.PostMessage(
        //   message.message,
        //   connParams.streamerID,
        //   connParams.userID,
        // );
      });
    }
  }
}
