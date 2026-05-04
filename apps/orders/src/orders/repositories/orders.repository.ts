import { Logger } from '@nestjs/common';

import { AbstractEntityRepository } from '@app/common/features/database';
import { Order } from '../entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatus } from '@app/orders-common';
import { FindAllOptions } from '../interfaces/find-all-options';

export class OrdersRepository extends AbstractEntityRepository<Order> {
  protected readonly logger: Logger = new Logger(OrdersRepository.name);

  constructor(@InjectRepository(Order) repo: Repository<Order>) {
    super(repo);
  }

  async ensureSearchInfrastructure(): Promise<void> {
    try {
      // Enable pg_trgm extension for trigram-based full-text search
      await this.repo.query('CREATE EXTENSION IF NOT EXISTS pg_trgm');

      // Create GIN index on searchText using trigram matching
      await this.repo.query(`
        CREATE INDEX IF NOT EXISTS idx_orders_search_vector_gin
        ON orders
        USING GIN (
          "searchText" gin_trgm_ops
        )
      `);
    } catch (error) {
      this.logger.warn(
        `Could not ensure full-text search infrastructure: ${error instanceof Error ? error.message : 'unknown error'}`,
      );
    }
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

  async searchByText(
    query: string,
    page: number,
    limit: number,
  ): Promise<{ data: Order[]; total: number }> {
    const normalizedQuery = query.trim();

    const qb = this.repo.createQueryBuilder('order');

    // Add similarity ranking using pg_trgm for better relevance sorting
    qb.addSelect(
      `similarity("order"."searchText", :similarityQuery)`,
      'similarity',
    );

    // Filter orders where searchText matches the query
    qb.where(`"order"."searchText" ILIKE :query`, {
      query: `%${normalizedQuery}%`,
      similarityQuery: normalizedQuery,
    });

    // Order by similarity score first
    qb.orderBy('similarity', 'DESC');
    qb.addOrderBy('"order"."createdAt"', 'DESC');

    qb.skip((page - 1) * limit);
    qb.take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }
}
