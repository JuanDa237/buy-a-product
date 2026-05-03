import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// App
import { AuditService } from './audit/services/audit.service';
import { AuditController } from './audit/controllers/audit.controller';

// Libs
import { HealthModule, NoSqlDatabaseModule } from '@app/common';

// Schemas
import {
  AuditEventDocument,
  AuditEventSchema,
} from './audit/schemas/audit-event.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    NoSqlDatabaseModule,
    NoSqlDatabaseModule.forFeature([
      {
        name: AuditEventDocument.name,
        schema: AuditEventSchema,
      },
    ]),
  ],
  controllers: [AuditController],
  providers: [AuditService],
})
export class AuditModule {}
