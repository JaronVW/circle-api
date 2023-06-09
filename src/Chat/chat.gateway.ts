import {
  WebSocketGateway,
  MessageBody,
  SubscribeMessage,
} from '@nestjs/websockets';

const uniqueStreamerId = 'b890b91f-2dee-4930-85ec-90235a47be9b';

const chatMessages = [];

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @SubscribeMessage(`event`)
  handleEvent(@MessageBody() data: string): string {
    chatMessages.push(data);
    return data;
  }
}
