import { ORDERS_MICROSERVICE } from './services';

describe('services constants', () => {
  it('exposes stable service names', () => {
    expect(ORDERS_MICROSERVICE).toBe('ORDERS_SERVICE');
  });
});
