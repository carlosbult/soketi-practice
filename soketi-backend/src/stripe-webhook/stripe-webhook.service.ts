import { Injectable } from '@nestjs/common';
import { CreateStripeWebhookDto } from './dto/create-stripe-webhook.dto';
import { UpdateStripeWebhookDto } from './dto/update-stripe-webhook.dto';

@Injectable()
export class StripeWebhookService {
  create(createStripeWebhookDto: CreateStripeWebhookDto) {
    return 'This action adds a new stripeWebhook';
  }

  findAll() {
    return `This action returns all stripeWebhook`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stripeWebhook`;
  }

  update(id: number, updateStripeWebhookDto: UpdateStripeWebhookDto) {
    return `This action updates a #${id} stripeWebhook`;
  }

  remove(id: number) {
    return `This action removes a #${id} stripeWebhook`;
  }
}
