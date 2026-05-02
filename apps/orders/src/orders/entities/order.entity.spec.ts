import { getMetadataArgsStorage } from 'typeorm';

import { Order } from './order.entity';

describe('Order Entity', () => {
  it('maps to the orders table', () => {
    const table = getMetadataArgsStorage().tables.find(
      (item) => item.target === Order,
    );

    expect(table?.name).toBe('orders');
  });

  it('defines required columns', () => {
    const columns = getMetadataArgsStorage()
      .columns.filter((item) => item.target === Order)
      .map((item) => item.propertyName);

    expect(columns).toEqual(
      expect.arrayContaining([
        'productId',
        'quantity',
        'userId',
        'status',
        'totalAmount',
      ]),
    );
  });
});
