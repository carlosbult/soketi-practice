import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripeWebhookModule } from './stripe-webhook/stripe-webhook.module';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    StripeWebhookModule,
    StripeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
