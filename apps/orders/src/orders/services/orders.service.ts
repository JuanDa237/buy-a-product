import { Injectable } from '@nestjs/common';

import { OrdersRepository } from '../repositories/orders.repository';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderStatus } from '../enums/order-status.enum';

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
}
