import { Module } from '@nestjs/common';

// App
import { AuditService } from './audit/services/audit.service';
import { AuditController } from './audit/controllers/audit.controller';

// Libs
import { HealthModule } from '@app/common';

@Module({
  imports: [HealthModule],
  controllers: [AuditController],
  providers: [AuditService],
})
export class AuditModule {}
