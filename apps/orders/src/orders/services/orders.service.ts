import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// Repositories
import { OrdersRepository } from '../repositories/orders.repository';

// Entities & DTOs
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';
import { QueryOrdersDto } from '../dto/query-orders.dto';

// Constants
import { VALID_STATUS_TRANSITIONS } from '../constants/order-status-transitions';

// Common
import { OrderStatus, OrderStatusChangedEvent } from '@app/orders-common';
import { AUDIT_MICROSERVICE } from '@app/audit-common';

@Injectable()
export class OrdersService implements OnModuleInit {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(AUDIT_MICROSERVICE) private readonly auditClient: ClientProxy,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.ordersRepository.ensureSearchInfrastructure();
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    const order = await this.ordersRepository.create({
      ...dto,
      status: OrderStatus.PENDING,
    } as Order);

    this.emitStatusChanged(order.id, null, OrderStatus.PENDING);

    return order;
  }

  async findAll(query: QueryOrdersDto) {
    const { status, userId, page = 1, limit = 10 } = query;
    return this.ordersRepository.findAll({ status, userId, page, limit });
  }

  async search(q: string, page = 1, limit = 10) {
    return this.ordersRepository.searchByText(q, page, limit);
  }

  async findOne(id: string): Promise<Order> {
    return this.ordersRepository.findById(id);
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.findOne(id);

    const { status: newStatus } = dto;
    const fromStatus = order.status;

    const allowedTransitions = VALID_STATUS_TRANSITIONS[order.status];
    if (!allowedTransitions.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from "${fromStatus}" to "${newStatus}". Allowed: [${allowedTransitions.join(', ')}]`,
      );
    }

    const updated = await this.ordersRepository.updateStatus(id, newStatus);

    if (!updated) {
      throw new NotFoundException(
        `Order with id ${id} not found for status update`,
      );
    }

    this.emitStatusChanged(id, fromStatus, newStatus);

    return updated;
  }

  // Events
  private emitStatusChanged(
    orderId: string,
    fromStatus: OrderStatus | null,
    toStatus: OrderStatus,
  ): void {
    const event: OrderStatusChangedEvent = {
      orderId,
      fromStatus,
      toStatus,
    };

    this.auditClient.emit('order.status.changed', event);
  }
}
