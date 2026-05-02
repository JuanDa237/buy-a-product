import { Controller, Get } from '@nestjs/common';
import { AuditService } from '../services/audit.service';

@Controller()
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('hello')
  getHello(): string {
    return this.auditService.getHello();
  }
}
