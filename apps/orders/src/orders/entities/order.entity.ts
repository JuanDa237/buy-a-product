import { Entity, Column } from 'typeorm';
import { OrderStatus } from '../enums/order-status.enum';
import { AbstractEntity } from '@app/common/database';

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
