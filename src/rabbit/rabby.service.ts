import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbyService implements OnModuleInit {
	private connection: amqp.AmqpConnectionManager;
	private channelWrapper: amqp.ChannelWrapper;

	constructor(private readonly configService: ConfigService) {}

	async onModuleInit() {
		const rubbitUrl = this.configService.get<string>('RABBIT_URL');
		this.connection = amqp.connect([rubbitUrl]);
		this.channelWrapper = this.connection.createChannel({
			json: true,
			setup: (channel) => this.setupChannel(channel),
		});
	}

	//   private async setupChannel(channel: amqp.Channel) {
	//     await channel.assertQueue('vi_queue', { durable: true });
	//     await channel.assertQueue('work.queue', { durable: true });
	//   }

	// очередь существует или создаём
	private async setupChannel(channel: amqp.Channel) {
		const q1 = this.configService.get<string>('RABBIT_QUEUE1') || '';
		const q2 = this.configService.get<string>('RABBIT_QUEUE2') || '';

		await channel.assertQueue(q1, { durable: true });
		await channel.bindQueue(q1, 'vi_exchange', q1);
		await channel.assertQueue(q2, { durable: true });
		await channel.bindQueue(q2, 'vi_exchange', q2);
	}

	async getQueueStats(queueName: string) {
		try {
			const stats = await this.channelWrapper.checkQueue(queueName);
			return {
				name: queueName,
				messages: stats.messageCount,
				consumers: stats.consumerCount,
			};
		} catch (error) {
			console.error(`Error getting stats for queue ${queueName}:`, error);
			return null;
		}
	}

	async getAllQueuesStats() {
		const q1 = this.configService.get<string>('RABBIT_QUEUE1') || '';
		const q2 = this.configService.get<string>('RABBIT_QUEUE2') || '';
		const viQueue = await this.getQueueStats(q1);
		const workQueue = await this.getQueueStats(q2);
		return { viQueue, workQueue };
	}
}
