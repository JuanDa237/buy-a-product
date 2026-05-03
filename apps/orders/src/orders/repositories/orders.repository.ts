import { Logger } from '@nestjs/common';

import { AbstractRepository } from '@app/common/features/database';
import { Order } from '../entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatus } from '../enums/order-status.enum';
import { FindAllOptions } from '../interfaces/find-all-options';

export class OrdersRepository extends AbstractRepository<Order> {
  protected readonly logger: Logger = new Logger(OrdersRepository.name);

  constructor(@InjectRepository(Order) repo: Repository<Order>) {
    super(repo);
  }

  async findAll(
    options: FindAllOptions,
  ): Promise<{ data: Order[]; total: number }> {
    const { status, userId, page, limit } = options;

    const qb = this.repo.createQueryBuilder('order');

    if (status) {
      qb.andWhere('order.status = :status', { status });
    }

    if (userId) {
      qb.andWhere('order.userId = :userId', { userId });
    }

    qb.orderBy('order.createdAt', 'DESC');
    qb.skip((page - 1) * limit);
    qb.take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order | null> {
    await this.repo.update(id, { status });
    return this.findById(id);
  }
}
