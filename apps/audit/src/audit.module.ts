import { Module } from '@nestjs/common';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { HealthModule } from '@app/common';

@Module({
  imports: [HealthModule],
  controllers: [AuditController],
  providers: [AuditService],
})
export class AuditModule {}
