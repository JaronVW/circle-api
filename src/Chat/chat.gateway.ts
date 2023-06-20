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

@WebSocketGateway({ cors: true })
export class ChatGateway {
  connectCounter: number = 0;
  connectionsPerUserID = new Map<number, number>();
  constructor(private service: ChatService) {}

  @WebSocketServer()
  server: Server;

  // @UseGuards(WsGuard)
  @SubscribeMessage('chat')
  async joinStream(
    @MessageBody() connParams: { streamerID: string; userID: number },
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(this.connectCounter);
    let amount = this.connectionsPerUserID.get(connParams.userID);
    if (!amount) {
      amount = 0;
    }
    if (amount < 4) {
      socket.emit("accepted");
      console.log("connectcounter");
      socket.join(connParams.streamerID);
      this.connectCounter++;
      console.log(this.connectionsPerUserID.get(connParams.userID));
      this.connectionsPerUserID.set(connParams.userID, amount + 1);
      console.log(this.connectionsPerUserID);
      socket.on(connParams.streamerID, async (message: MessageDto) => {
        console.log(message, message.message, connParams.streamerID, connParams.userID);
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
      socket.on('disconnect', () => {
        this.connectionsPerUserID.set(connParams.userID, this.connectionsPerUserID.get(connParams.userID) - 1);
        if (this.server.sockets.adapter.rooms.get(connParams.streamerID)) {
          this.server.to(connParams.streamerID).emit("viewers", this.server.sockets.adapter.rooms.get(connParams.streamerID).size);
          console.log("No of viewers: " + this.server.sockets.adapter.rooms.get(connParams.streamerID).size);
          console.log(this.connectionsPerUserID);
        }
        console.log("leave room, ", this.connectCounter);
      });
      this.server.to(connParams.streamerID).emit("viewers", this.server.sockets.adapter.rooms.get(connParams.streamerID).size);
      console.log("No of viewers: " + this.server.sockets.adapter.rooms.get(connParams.streamerID).size);
    } else {
      socket.emit("rejected");
    }
  }
}
