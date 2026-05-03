import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from '../services/audit.service';
import { AuditController } from './audit.controller';
import { OrderStatusChangedEvent, OrderStatus } from '@app/orders-common';

describe('AuditController', () => {
  let auditController: AuditController;
  let auditService: { logStatusChange: jest.Mock; getAuditLog: jest.Mock };

  beforeEach(async () => {
    auditService = {
      logStatusChange: jest.fn(),
      getAuditLog: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuditController],
      providers: [{ provide: AuditService, useValue: auditService }],
    }).compile();

    auditController = app.get<AuditController>(AuditController);
  });

  describe('handleOrderStatusChanged', () => {
    it('delegates event logging to service', async () => {
      const event: OrderStatusChangedEvent = {
        orderId: 'order-1',
        fromStatus: OrderStatus.PENDING,
        toStatus: OrderStatus.CONFIRMED,
        metadata: { actor: 'system' },
      };

      await auditController.handleOrderStatusChanged(event);

      expect(auditService.logStatusChange).toHaveBeenCalledWith(event);
    });
  });

  describe('getAuditLog', () => {
    it('delegates to service with orderId', async () => {
      const orderId = 'order-1';
      const expected = [
        {
          id: 'audit-1',
          orderId,
          fromStatus: null,
          toStatus: OrderStatus.PENDING,
          metadata: {},
        },
      ];

      auditService.getAuditLog = jest.fn().mockResolvedValue(expected);

      await expect(auditController.getAuditLog(orderId)).resolves.toEqual(
        expected,
      );
      expect(auditService.getAuditLog).toHaveBeenCalledWith(orderId);
    });
  });
});
