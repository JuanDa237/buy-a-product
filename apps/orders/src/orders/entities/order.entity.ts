import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '@app/common/features/database';
import { OrderStatus } from '@app/orders-common';

@Entity('orders')
export class Order extends AbstractEntity {
  @Column()
  productId!: string;

  @Column({ type: 'int' })
  quantity!: number;

  @Column()
  userId!: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status!: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount!: number;
}
