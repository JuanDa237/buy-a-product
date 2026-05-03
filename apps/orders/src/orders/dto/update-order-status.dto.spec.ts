import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { UpdateOrderStatusDto } from './update-order-status.dto';
import { OrderStatus } from '@app/orders-common';

describe('UpdateOrderStatusDto', () => {
  it('is valid with correct payload', async () => {
    const dto = plainToInstance(UpdateOrderStatusDto, {
      status: OrderStatus.PENDING,
    });

    await expect(validate(dto)).resolves.toHaveLength(0);
  });

  it('fails when status is not a valid enum value', async () => {
    const dto = plainToInstance(UpdateOrderStatusDto, {
      status: 'INVALID_STATUS',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('status');
  });
});
