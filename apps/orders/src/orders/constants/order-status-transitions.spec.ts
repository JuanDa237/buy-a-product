import { VALID_STATUS_TRANSITIONS } from './order-status-transitions';

describe('VALID_STATUS_TRANSITIONS', () => {
  it('should have valid transitions for each order status', () => {
    expect(VALID_STATUS_TRANSITIONS).toEqual({
      PENDING: ['CONFIRMED', 'CANCELED'],
      CONFIRMED: ['SHIPPED', 'CANCELED'],
      SHIPPED: ['DELIVERED'],
      DELIVERED: [],
      CANCELED: [],
    });
  });
});
