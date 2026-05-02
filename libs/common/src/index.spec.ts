import {
  AUDIT_SERVICE,
  HealthController,
  HealthModule,
  ORDERS_SERVICE,
} from '.';

describe('common public API', () => {
  it('re-exports constants and health feature', () => {
    expect(ORDERS_SERVICE).toBe('ORDERS_SERVICE');
    expect(AUDIT_SERVICE).toBe('AUDIT_SERVICE');
    expect(HealthController).toBeDefined();
    expect(HealthModule).toBeDefined();
  });
});
