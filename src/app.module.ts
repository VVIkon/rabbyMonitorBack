import { Module } from '@nestjs/common';
import { RabbyModule } from './rabbit/rabby.module';
import { QueueGateway } from './queue/queue.gateway';
import { QueueController } from './queue/queue.controller';

@Module({
  imports: [RabbyModule],
  providers: [QueueGateway],
  controllers: [QueueController],
})
export class AppModule {}
