import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StripeWebhookService } from './stripe-webhook.service';
import { CreateStripeWebhookDto } from './dto/create-stripe-webhook.dto';
import { UpdateStripeWebhookDto } from './dto/update-stripe-webhook.dto';

@Controller('stripe-webhook')
export class StripeWebhookController {
  constructor(private readonly stripeWebhookService: StripeWebhookService) {}

  @Post()
  create(@Body() createStripeWebhookDto: CreateStripeWebhookDto) {
    return this.stripeWebhookService.create(createStripeWebhookDto);
  }

  @Get()
  findAll() {
    return this.stripeWebhookService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stripeWebhookService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStripeWebhookDto: UpdateStripeWebhookDto) {
    return this.stripeWebhookService.update(+id, updateStripeWebhookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stripeWebhookService.remove(+id);
  }
}
