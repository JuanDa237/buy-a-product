import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';

import { OrdersRepository } from './orders.repository';
import { Order } from '../entities/order.entity';

describe('OrdersRepository', () => {
  let repository: OrdersRepository;
  let typeormRepository: {
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
  };

  beforeEach(() => {
    typeormRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    repository = new OrdersRepository(
      typeormRepository as unknown as Repository<Order>,
    );
  });

  it('extends AbstractRepository behavior for create', async () => {
    const input = {
      productId: 'product-1',
      quantity: 2,
      userId: 'user-1',
      totalAmount: 150,
    } as Order;

    const payload = { ...input };
    const saved = {
      ...payload,
      id: 'f7932cad-af29-460e-938f-2ec9e57c0a33',
    };

    typeormRepository.create.mockReturnValue(payload);
    typeormRepository.save.mockResolvedValue(saved);

    await expect(repository.create(input)).resolves.toEqual(saved);
    expect(typeormRepository.create).toHaveBeenCalledWith(input);
    expect(typeormRepository.save).toHaveBeenCalledWith(payload);
  });

  it('defines a Logger instance', () => {
    const logger = (repository as unknown as { logger: Logger }).logger;
    expect(logger).toBeInstanceOf(Logger);
  });
});
