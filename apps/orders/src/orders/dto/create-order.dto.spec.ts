import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { CreateOrderDto } from './create-order.dto';

describe('CreateOrderDto', () => {
  it('is valid with correct payload', async () => {
    const dto = plainToInstance(CreateOrderDto, {
      productId: 'product-1',
      quantity: 2,
      userId: 'user-1',
      totalAmount: 150.5,
      searchText: 'entrega tarde regalo',
    });

    await expect(validate(dto)).resolves.toHaveLength(0);
  });

  it('fails when quantity is below 1', async () => {
    const dto = plainToInstance(CreateOrderDto, {
      productId: 'product-1',
      quantity: 0,
      userId: 'user-1',
      totalAmount: 150.5,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('quantity');
  });

  it('fails when totalAmount is not positive', async () => {
    const dto = plainToInstance(CreateOrderDto, {
      productId: 'product-1',
      quantity: 1,
      userId: 'user-1',
      totalAmount: 0,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('totalAmount');
  });

  it('fails when searchText is not a string', async () => {
    const dto = plainToInstance(CreateOrderDto, {
      productId: 'product-1',
      quantity: 1,
      userId: 'user-1',
      totalAmount: 100,
      searchText: 123,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('searchText');
  });
});
