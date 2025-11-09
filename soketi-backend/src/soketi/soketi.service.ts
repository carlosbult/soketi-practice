import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Pusher from 'pusher';

@Injectable()
export class SoketiService {
  private pusher: Pusher;
  private readonly logger = new Logger(SoketiService.name);

  constructor(private readonly configService: ConfigService) {
    this.pusher = new Pusher({
      appId: this.configService.get<string>('SOKETI_APP_ID') ?? '',
      key: this.configService.get<string>('SOKETI_APP_KEY') ?? '',
      secret: this.configService.get<string>('SOKETI_APP_SECRET') ?? '',
      port: this.configService.get<string>('SOKETI_APP_PORT') ?? '6001',
      host: this.configService.get<string>('SOKETI_APP_HOST') ?? '127.0.0.1',

      // Cluster para produccion
      // cluster: this.configService.get<string>('SOKETI_APP_CLUSTER') ?? '',
      // useTLS: this.configService.get<boolean>('SOKETI_APP_USE_TLS') ?? false,
    });
  }

  async broadcast(channel: string, event: string, data: any): Promise<boolean> {
    try {
      console.log('Suscribiéndose al type of :', typeof data);

      await this.pusher.trigger(channel, event, data);

      this.logger.debug(
        `[Soketi] Evento '${event}' enviado al canal '${channel}'`,
      );
      return true;
    } catch (error) {
      this.logger.error('Error triggering event:', error);
      return false;
    }
  }
}
