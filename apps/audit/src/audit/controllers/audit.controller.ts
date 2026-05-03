import { Controller } from '@nestjs/common';
import { AuditService } from '../services/audit.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { OrderStatusChangedEvent } from '@app/orders-common';

@Controller()
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @EventPattern('order.status.changed')
  async handleOrderStatusChanged(@Payload() event: OrderStatusChangedEvent) {
    // await this.auditService.logStatusChange(event);
  }
}
