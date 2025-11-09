import {
  Controller,
  Logger,
  RawBodyRequest,
  Headers,
  Req,
} from '@nestjs/common';
import { StripeWebhook } from 'src/common/decorators/stripe-webhook.decorator';
import { StripeWebhookService } from './stripe-webhook.service';
import { ConfigService } from '@nestjs/config';

@Controller('stripe-webhook')
export class StripeWebhookController {
  private readonly logger = new Logger(StripeWebhookController.name);
  private readonly webhookSecret: string;

  constructor(
    private readonly stripeWebhookService: StripeWebhookService,
    private readonly configService: ConfigService,
  ) {
    this.webhookSecret =
      this.configService.get<string>('STRIPE_WEBHOOK_SECRET') ?? '';
    if (this.webhookSecret === '') {
      throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
    }
  }

  @StripeWebhook('')
  async handleWebhookEvent(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<any>,
  ) {
    if (!signature) {
      return;
    }

    return this.stripeWebhookService.handleWebhookEvent(signature, req.rawBody);
  }
}
