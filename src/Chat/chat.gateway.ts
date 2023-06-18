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
import { subscribe } from 'diagnostics_channel';
import * as child_process from 'child_process';

const ffmpeg = child_process.spawn('ffmpeg', [
  '-f',
  'lavfi',
  '-i',
  'anullsrc',
  '-i',
  '-',
  '-c:v',
  'libx264',
  '-preset',
  'veryfast',
  '-tune',
  'zerolatency',
  '-c:a',
  'aac',
  '-f',
  'flv',
  `rtmp://localhost/ffmpeg`,
]);

ffmpeg.stderr.on('data', (data) => {
  console.log('FFmpeg STDERR:', data.toString());
});

@WebSocketGateway({ cors: true })
export class ChatGateway {
  constructor(private service: ChatService) { }

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



  @SubscribeMessage('data')
  async getData(@MessageBody() data: any) {


    ffmpeg.stdin.write(data);
  }
}
