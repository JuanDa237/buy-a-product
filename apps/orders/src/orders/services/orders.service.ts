import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { OrdersRepository } from '../repositories/orders.repository';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderStatus } from '../enums/order-status.enum';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';
import { VALID_STATUS_TRANSITIONS } from '../constants/order-status-transitions';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    return this.ordersRepository.create({
      ...dto,
      status: OrderStatus.PENDING,
    } as Order);
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

    return updated;
  }
}
