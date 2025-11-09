import { PartialType } from '@nestjs/mapped-types';
import { CreateStripeWebhookDto } from './create-stripe-webhook.dto';

export class UpdateStripeWebhookDto extends PartialType(CreateStripeWebhookDto) {}
