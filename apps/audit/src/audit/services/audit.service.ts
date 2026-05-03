import { Injectable } from '@nestjs/common';
import { AuditRepository } from '../repositories/audit.repository';
import { OrderStatusChangedEvent } from '@app/orders-common';
import { AuditEventDocument } from '../schemas/audit-event.schema';

@Injectable()
export class AuditService {
  constructor(private readonly auditRepository: AuditRepository) {}

  async logStatusChange(
    event: OrderStatusChangedEvent,
  ): Promise<AuditEventDocument> {
    return this.auditRepository.create({
      orderId: event.orderId,
      fromStatus: event.fromStatus,
      toStatus: event.toStatus,
      metadata: event.metadata ?? {},
    });
  }

  async getAuditLog(orderId: string): Promise<AuditEventDocument[]> {
    return this.auditRepository.findByOrderId(orderId);
  }
}
