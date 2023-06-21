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
import { WsGuard } from 'src/auth/ws.guard';
import { MessageDto } from './message.dto';
import {
  verifySignatureChatMessage,
  verifySignatureChatRequest,
} from './cryptMethods';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  connectionsPerUserID = new Map<number, number>();

  constructor(private service: ChatService) {}

  @WebSocketServer()
  server: Server;

  // @UseGuards(WsGuard)
  @SubscribeMessage('chat')
  async joinStream(
    @MessageBody()
    connParams: {
      streamerID: string;
      userID: number;
      publicKey: string;
      signature: string;
    },
    @ConnectedSocket() socket: Socket,
  ) {
    let amount = this.connectionsPerUserID.get(connParams.userID);
    if (!amount) {
      amount = 0;
    }
    if (amount < 4) {
      console.log(connParams);
      if (
        !verifySignatureChatRequest(
          {
            streamerID: connParams.streamerID,
            userID: connParams.userID,
          },
          connParams.signature,
          connParams.publicKey,
        )
      ) {
        console.log('Invalid signature');
        socket.emit('rejected', 'Invalid signature');
        return;
      }
      socket.emit('accepted');
      socket.join(connParams.streamerID);
      this.connectionsPerUserID.set(connParams.userID, amount + 1);
      socket.on(connParams.streamerID, async (message: MessageDto) => {
        if (
          !verifySignatureChatMessage(
            {
              message: message.message,
              fullName: message.fullName,
              datetime: message.datetime,
            },
            message.signature,
            connParams.publicKey,
          )
        ) {
          console.log(message);
          return;
        }
        console.log({
          originalData: {
            message: message.message,
            fullName: message.fullName,
            datetime: message.datetime,
          },
          signature: message.signature,
          publicKey: connParams.publicKey,
        });
        this.server.to(connParams.streamerID).emit(connParams.streamerID, {
          originalData: {
            message: message.message,
            fullName: message.fullName,
            datetime: message.datetime,
          },
          signature: message.signature,
          publicKey: connParams.publicKey,
        });
        await this.service.PostMessage(
          message.message,
          connParams.streamerID,
          connParams.userID,
        );
      });
      socket.on('disconnect', () => {
        this.connectionsPerUserID.set(
          connParams.userID,
          this.connectionsPerUserID.get(connParams.userID) - 1,
        );
        if (this.server.sockets.adapter.rooms.get(connParams.streamerID)) {
          this.server
            .to(connParams.streamerID)
            .emit(
              'viewers',
              this.server.sockets.adapter.rooms.get(connParams.streamerID).size,
            );
          console.log(
            'No of viewers: ' +
              this.server.sockets.adapter.rooms.get(connParams.streamerID).size,
          );
        } 
      });
      this.server
        .to(connParams.streamerID)
        .emit(
          'viewers',
          this.server.sockets.adapter.rooms.get(connParams.streamerID).size,
        );
      console.log(
        'No of viewers: ' +
          this.server.sockets.adapter.rooms.get(connParams.streamerID).size,
      );
    } else {
      socket.emit('rejected', 'Too many connections');
    }
  }
}
