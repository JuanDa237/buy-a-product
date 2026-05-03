import { OrderStatus } from '@app/orders-common';

export interface FindAllOptions {
  status?: OrderStatus;
  userId?: string;
  page: number;
  limit: number;
}
