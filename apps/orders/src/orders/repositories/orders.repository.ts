import { Logger } from '@nestjs/common';

import { AbstractRepository } from '@app/common/database';
import { Order } from '../entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatus } from '../enums/order-status.enum';

export class OrdersRepository extends AbstractRepository<Order> {
  protected readonly logger: Logger = new Logger(OrdersRepository.name);

  constructor(@InjectRepository(Order) repo: Repository<Order>) {
    super(repo);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order | null> {
    await this.repo.update(id, { status });
    return this.findById(id);
  }
}
