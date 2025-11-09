import { applyDecorators, Post, UseInterceptors } from '@nestjs/common';
import { RawBodyInterceptor } from '../interceptors/raw-body.interceptor';

export function StripeWebhook(path?: string) {
  return applyDecorators(
    UseInterceptors(RawBodyInterceptor),
    Post(path || '/webhook'),
  );
}
