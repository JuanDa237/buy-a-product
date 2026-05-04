import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';

import { HttpThrottlerGuard } from './http-throttler.guard';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: Number(configService.get('THROTTLE_TTL_MS') ?? 60000),
          limit: Number(configService.get('THROTTLE_LIMIT') ?? 10),
        },
      ],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: HttpThrottlerGuard,
    },
  ],
  exports: [ThrottlerModule],
})
export class CommonThrottlerModule {}
