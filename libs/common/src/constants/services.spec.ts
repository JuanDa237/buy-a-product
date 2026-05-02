import { AUDIT_SERVICE, ORDERS_SERVICE } from './services';

describe('services constants', () => {
  it('exposes stable service names', () => {
    expect(ORDERS_SERVICE).toBe('ORDERS_SERVICE');
    expect(AUDIT_SERVICE).toBe('AUDIT_SERVICE');
  });
});
