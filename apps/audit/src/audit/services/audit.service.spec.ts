import { AuditService } from './audit.service';
import { AuditRepository } from '../repositories/audit.repository';
import { OrderStatus, OrderStatusChangedEvent } from '@app/orders-common';

describe('AuditService', () => {
  let service: AuditService;
  let auditRepository: { create: jest.Mock; findByOrderId?: jest.Mock };

  beforeEach(() => {
    auditRepository = {
      create: jest.fn(),
      findByOrderId: jest.fn(),
    };

    service = new AuditService(auditRepository as unknown as AuditRepository);
  });

  it('logStatusChange delegates to repository with event payload', async () => {
    const event: OrderStatusChangedEvent = {
      orderId: 'order-1',
      fromStatus: OrderStatus.PENDING,
      toStatus: OrderStatus.CONFIRMED,
      metadata: { actor: 'system' },
    };

    const saved = { id: 'audit-1', ...event };
    auditRepository.create.mockResolvedValue(saved);

    await expect(service.logStatusChange(event)).resolves.toEqual(saved);
    expect(auditRepository.create).toHaveBeenCalledWith({
      orderId: event.orderId,
      fromStatus: event.fromStatus,
      toStatus: event.toStatus,
      metadata: event.metadata,
    });
  });

  it('logStatusChange defaults metadata to empty object', async () => {
    const event: OrderStatusChangedEvent = {
      orderId: 'order-2',
      fromStatus: null,
      toStatus: OrderStatus.CANCELED,
    };

    auditRepository.create.mockResolvedValue({ id: 'audit-2', ...event });

    await service.logStatusChange(event);

    expect(auditRepository.create).toHaveBeenCalledWith({
      orderId: event.orderId,
      fromStatus: event.fromStatus,
      toStatus: event.toStatus,
      metadata: {},
    });
  });

  it('getAuditLog delegates to repository with orderId', async () => {
    const orderId = 'order-1';
    const expected = [{ id: 'audit-1', orderId }] as any[];
    auditRepository.findByOrderId = jest.fn().mockResolvedValue(expected);

    await expect(service.getAuditLog(orderId)).resolves.toEqual(expected);
    expect(auditRepository.findByOrderId).toHaveBeenCalledWith(orderId);
  });
});
