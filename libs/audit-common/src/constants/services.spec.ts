import { AUDIT_MICROSERVICE } from './services';

describe('services constants', () => {
  it('exposes stable service names', () => {
    expect(AUDIT_MICROSERVICE).toBe('AUDIT_MICROSERVICE');
  });
});
