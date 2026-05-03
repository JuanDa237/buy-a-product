import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AUDIT_SERVICE } from '@app/common';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: AUDIT_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('AUDIT_TCP_HOST', 'localhost'),
            port: configService.get<number>('AUDIT_TCP_PORT', 4000),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class AuditTCPModule {}
