import { Module } from '@nestjs/common';
import { RabbyService } from '../rabbit/rabby.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

function validateConfig(config: Record<string, unknown>) {
	if (!config.SERVER_PORT || config.SERVER_PORT === 0) {
		throw new Error('Invalid Server Port in configuration');
	}
	if (!config.RABBIT_URL || !config.RABBIT_QUEUE1 || !config.RABBIT_QUEUE2) {
		throw new Error('Invalid Rabbit in configuration');
	}

	return config;
}

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
			validate: validateConfig,
		}),
	],
	providers: [ConfigService, RabbyService],
	exports: [RabbyService],
})
export class RabbyModule {}
