import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/festive',
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
  },
})
export class StickerGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(StickerGateway.name);

  afterInit() {
    this.logger.log('StickerGateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joint:article')
  async handleJoinArticle(client: Socket, articleId: string) {
    await client.join(articleId);
    this.logger.log(`Client ${client.id} joined article ${articleId}`);
  }
}
