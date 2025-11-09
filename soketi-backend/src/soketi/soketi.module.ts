import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SoketiService } from './soketi.service';

@Module({
  imports: [ConfigModule],
  providers: [SoketiService],
  exports: [SoketiService],
})
export class SoketiModule {}
