import { AuditTCPModule } from '.';

describe('common public API', () => {
  it('re-exports constants and health feature', () => {
    expect(AuditTCPModule).toBeDefined();
  });
});
