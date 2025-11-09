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
    console.log('payload', payload);
    console.log('signature', signature);
    console.log(
      'STRIPE_WEBHOOK_SECRET',
      this.configService.get<string>('STRIPE_WEBHOOK_SECRET'),
    );

    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.configService.get<string>('STRIPE_WEBHOOK_SECRET') ?? '',
    );

    console.log('event', event);

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await this.soketiService.broadcast(
          'payment_intent.succeeded',
          'payment_intent.succeeded',
          paymentIntent,
        );
        break;
      // Add more event types as needed
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }
}
