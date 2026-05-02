import { Logger } from '@nestjs/common';

import { AbstractRepository } from '@app/common/database';
import { Order } from '../entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class OrdersRepository extends AbstractRepository<Order> {
  protected readonly logger: Logger = new Logger(OrdersRepository.name);

  constructor(@InjectRepository(Order) orderRepository: Repository<Order>) {
    super(orderRepository);
  }
}
