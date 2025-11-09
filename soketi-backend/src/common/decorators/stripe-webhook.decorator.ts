// src/common/decorators/webhook.decorator.ts
import {
  applyDecorators,
  Post,
  RawBodyRequest,
  UseInterceptors,
} from '@nestjs/common';
import { RawBodyInterceptor } from '../interceptors/raw-body.interceptor';

export function StripeWebhook(path?: string) {
  return applyDecorators(
    Post(path || '/webhook'),
    UseInterceptors(RawBodyInterceptor),
  );
}
