import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { QueryOrdersDto } from './query-orders.dto';
import { OrderStatus } from '../enums/order-status.enum';

describe('QueryOrdersDto', () => {
  it('is valid with correct payload', async () => {
    const dto = plainToInstance(QueryOrdersDto, {
      status: OrderStatus.PENDING,
      userId: 'user-123',
      page: 2,
      limit: 20,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('fails when status is not a valid enum value', async () => {
    const dto = plainToInstance(QueryOrdersDto, {
      status: 'INVALID_STATUS' as OrderStatus,
      userId: 'user-123',
      page: 2,
      limit: 20,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('status');
  });
});
