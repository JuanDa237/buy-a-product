import { OrderStatus } from '../enums/order-status.enum';
import { FindAllOptions } from './find-all-options';

describe('FindAllOptions', () => {
  it('should create an instance of FindAllOptions with valid properties', () => {
    const options: FindAllOptions = {
      status: OrderStatus.PENDING,
      userId: 'user-123',
      page: 1,
      limit: 10,
    };

    expect(options).toBeDefined();
    expect(options.status).toBe(OrderStatus.PENDING);
    expect(options.userId).toBe('user-123');
    expect(options.page).toBe(1);
    expect(options.limit).toBe(10);
  });

  it('should allow optional properties to be undefined', () => {
    const options: FindAllOptions = {
      page: 1,
      limit: 10,
    };

    expect(options).toBeDefined();
    expect(options.status).toBeUndefined();
    expect(options.userId).toBeUndefined();
    expect(options.page).toBe(1);
    expect(options.limit).toBe(10);
  });
});
