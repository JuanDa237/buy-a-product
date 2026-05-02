import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from '../services/audit.service';
import { AuditController } from './audit.controller';

describe('AuditController', () => {
  let auditController: AuditController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuditController],
      providers: [AuditService],
    }).compile();

    auditController = app.get<AuditController>(AuditController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(auditController.getHello()).toBe('Hello World!');
    });
  });
});
