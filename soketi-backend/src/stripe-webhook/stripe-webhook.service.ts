import { Inject, Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { ConfigService } from '@nestjs/config';
import { SoketiService } from '../soketi/soketi.service';

@Injectable()
export class StripeWebhookService {
  constructor(
    @Inject('STRIPE_CLIENT') private readonly stripe: Stripe,
    private readonly configService: ConfigService,
    private readonly soketiService: SoketiService,
  ) {}

  async handleWebhookEvent(signature: string, payload: Buffer) {
    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.configService.get<string>('STRIPE_WEBHOOK_SECRET') ?? '',
    );

    // Handle the event
    switch (event.type) {
      case 'charge.succeeded':
        const charge = event.data.object;
        await this.soketiService.broadcast(
          'private-charge.succeeded',
          'charge.succeeded',
          charge,
        );
        break;

      case 'payment_intent.created':
        await this.soketiService.broadcast(
          'payment_intent.created',
          'payment_intent.created',
          event.data.object,
        );
        break;

      case 'payment_intent.succeeded':
        await this.soketiService.broadcast(
          'payment_intent.succeeded',
          'payment_intent.succeeded',
          event.data.object,
        );
        break;

      case 'charge.updated':
        await this.soketiService.broadcast(
          'charge.updated',
          'charge.updated',
          event.data.object,
        );
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }
}
