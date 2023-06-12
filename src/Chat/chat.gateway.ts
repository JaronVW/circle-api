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
      'ffmpeg -re -i _ -c:v libx264 -preset veryfast -tune zerolatency -c:a aac -ar 44100 -f flv rtmp://localhost/live/STREAM_NAME',
    ]);

    ffmpeg.stderr.on('data', (data) => {
      console.log('FFmpeg STDERR:', data.toString());
    });
    console.log(data);
    ffmpeg.stdin.write(data);
  }
}
