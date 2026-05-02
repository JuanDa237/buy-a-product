import { AuditService } from './audit.service';

describe('AuditService', () => {
  it('returns hello message', () => {
    const service = new AuditService();
    expect(service.getHello()).toBe('Hello World!');
  });
});
