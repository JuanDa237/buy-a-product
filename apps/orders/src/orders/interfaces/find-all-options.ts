import { OrderStatus } from '../enums/order-status.enum';

export interface FindAllOptions {
  status?: OrderStatus;
  userId?: string;
  page: number;
  limit: number;
}
