import { STARTUP_SEED_ORDERS } from './orders';

describe('Orders Seed Data', () => {
  it('should have the correct structure and values', () => {
    expect(STARTUP_SEED_ORDERS).toBeInstanceOf(Array);
    expect(STARTUP_SEED_ORDERS.length).toBeGreaterThan(0);

    STARTUP_SEED_ORDERS.forEach((order) => {
      expect(order).toHaveProperty('productId');
      expect(order).toHaveProperty('quantity');
      expect(order).toHaveProperty('userId');
      expect(order).toHaveProperty('status');
      expect(order).toHaveProperty('totalAmount');
      expect(order).toHaveProperty('searchText');

      expect(typeof order.productId).toBe('string');
      expect(typeof order.quantity).toBe('number');
      expect(typeof order.userId).toBe('string');
      expect(order.status).toBe('PENDING');
      expect(typeof order.totalAmount).toBe('number');
      expect(typeof order.searchText).toBe('string');
    });
  });
});
