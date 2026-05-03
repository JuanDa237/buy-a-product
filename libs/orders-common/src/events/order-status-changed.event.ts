import { OrderStatus } from '../enums/order-status.enum';

export class OrderStatusChangedEvent {
  orderId!: string;
  fromStatus!: OrderStatus | null;
  toStatus!: OrderStatus;
  metadata?: Record<string, unknown>;
}
