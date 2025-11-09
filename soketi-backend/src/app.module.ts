import { Module } from '@nestjs/common';
import { StripeWebhookModule } from './stripe-webhook/stripe-webhook.module';

@Module({
  imports: [StripeWebhookModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
