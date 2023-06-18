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
import { generateSymmetricSignature } from './cryptMethods';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  constructor(private service: ChatService) { }

  @WebSocketServer()
  server: Server;

  // @UseGuards(WsGuard)
  @SubscribeMessage('chatchecksum')
  async joinStreamChecksum(
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
      // simple checksum to ensure data integrity
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

  // @UseGuards(WsGuard)
  @SubscribeMessage('chatsymsignature')
  async joinStreamSymSignature(
    @MessageBody()
    connParams: { streamerID: string; userID: number; key: string },
    @ConnectedSocket() socket: Socket,
  ) {
    socket.join(connParams.streamerID);
    socket.on(connParams.streamerID, async (message: MessageDto) => {
      console.log(message);
      message.datetime = new Date();
      const signature = generateSymmetricSignature(message, connParams.key);
      // generate the signature to be sent to the client
      console.log(signature);
      this.server
        .to(connParams.streamerID)
        .emit(connParams.streamerID, { ...message, signature });
      // await this.service.PostMessage(
      //   message.message,
      //   connParams.streamerID,
      //   connParams.userID,
      // );
    });
  }
}
