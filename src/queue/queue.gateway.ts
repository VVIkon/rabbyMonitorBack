import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { RabbyService } from '../rabbit/rabby.service';
import { interval } from 'rxjs';

@WebSocketGateway({ cors: true })
export class QueueGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly rabbyService: RabbyService) {}

  afterInit() {
    interval(3000).subscribe(async () => {
      const stats = await this.rabbyService.getAllQueuesStats();
      this.server.emit('queueStats', stats);
    });
  }
}
