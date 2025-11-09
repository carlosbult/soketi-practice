// src/stripe/stripe.module.ts
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Stripe } from 'stripe';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'STRIPE_CLIENT',
      useFactory: (configService: ConfigService) => {
        const stripeSecretKey = configService.get<string>('STRIPE_SECRET_KEY');
        if (!stripeSecretKey) {
          throw new Error(
            'STRIPE_SECRET_KEY is not defined in environment variables',
          );
        }
        return new Stripe(stripeSecretKey, {
          apiVersion: '2025-10-29.clover',
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['STRIPE_CLIENT'],
})
export class StripeModule {}
