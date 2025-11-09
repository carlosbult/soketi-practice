import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Pusher from 'pusher';

@Injectable()
export class SoketiService {
  private pusher: Pusher;
  private readonly logger = new Logger(SoketiService.name);

  constructor(private readonly configService: ConfigService) {
    this.pusher = new Pusher({
      appId: this.configService.get<string>('PUSHER_APP_ID') ?? '',
      key: this.configService.get<string>('PUSHER_APP_KEY') ?? '',
      secret: this.configService.get<string>('PUSHER_APP_SECRET') ?? '',
      cluster: this.configService.get<string>('PUSHER_APP_CLUSTER') ?? '',
      useTLS: true,
    });
  }

  async broadcast(channel: string, event: string, data: any): Promise<boolean> {
    try {
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
