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
@WebSocketGateway({ cors: true })
export class ChatGateway {
  constructor(private service: ChatService) {}

  @SubscribeMessage('chat')
  async joinStream(
    @MessageBody() streamId: string,
    @ConnectedSocket() socket: Socket,
    @AuthUser() user: JWTDecodedUser,
  ) {
    socket.join(streamId);
    socket.on(streamId, (message) => {
      socket.to(streamId).emit(streamId, message);
      this.service.PostMessage({
        message: message,
        userId: user.userId,
        streamId: streamId,
      });
    });
  }

  @SubscribeMessage('data')
  async getData(@MessageBody() data: string) {
    const ffmpeg = child.spawn('ffmpeg', [
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
      `rtmp://127.0.0.1:1935/live/key`,
    ]);
    console.log(data);
    ffmpeg.stdin.write(data);
  }
}
