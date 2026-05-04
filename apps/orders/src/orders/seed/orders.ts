import { OrderStatus } from '@app/orders-common';
import { Order } from '../entities/order.entity';

// Sample orders to seed the database on startup for testing and development purposes.
// Each order includes one of the following terms to ensure they are indexed and retrievable via full-text search.
// “tarde”, “regalo”, “urgente”, “mañana”
export const STARTUP_SEED_ORDERS: ReadonlyArray<
  Omit<Order, 'id' | 'createdAt' | 'updatedAt'>
> = [
  {
    productId: 'prod-uuid-201',
    quantity: 1,
    userId: 'user-uuid-501',
    status: OrderStatus.PENDING,
    totalAmount: 80,
    searchText: 'Entrega en la tarde con empaque de regalo',
  },
  {
    productId: 'prod-uuid-202',
    quantity: 2,
    userId: 'user-uuid-502',
    status: OrderStatus.PENDING,
    totalAmount: 150,
    searchText: 'Pedido urgente con entrega en la mañana',
  },
  {
    productId: 'prod-uuid-203',
    quantity: 1,
    userId: 'user-uuid-503',
    status: OrderStatus.PENDING,
    totalAmount: 60,
    searchText: 'Empaque de regalo con mensaje personalizado',
  },
  {
    productId: 'prod-uuid-204',
    quantity: 3,
    userId: 'user-uuid-504',
    status: OrderStatus.PENDING,
    totalAmount: 210,
    searchText: 'Entrega urgente en la tarde con empaque sencillo',
  },
  {
    productId: 'prod-uuid-205',
    quantity: 1,
    userId: 'user-uuid-505',
    status: OrderStatus.PENDING,
    totalAmount: 95,
    searchText: 'Entrega en la mañana temprano sin empaque de regalo',
  },
  {
    productId: 'prod-uuid-206',
    quantity: 4,
    userId: 'user-uuid-506',
    status: OrderStatus.PENDING,
    totalAmount: 300,
    searchText: 'Pedido corporativo con entrega en la tarde',
  },
  {
    productId: 'prod-uuid-207',
    quantity: 2,
    userId: 'user-uuid-507',
    status: OrderStatus.PENDING,
    totalAmount: 130,
    searchText: 'Cliente solicita envío urgente con empaque de regalo',
  },
  {
    productId: 'prod-uuid-208',
    quantity: 1,
    userId: 'user-uuid-508',
    status: OrderStatus.PENDING,
    totalAmount: 70,
    searchText: 'Entrega estándar en la noche sin urgencia',
  },
  {
    productId: 'prod-uuid-209',
    quantity: 2,
    userId: 'user-uuid-509',
    status: OrderStatus.PENDING,
    totalAmount: 180,
    searchText: 'Regalo sorpresa con entrega en la tarde',
  },
  {
    productId: 'prod-uuid-210',
    quantity: 1,
    userId: 'user-uuid-510',
    status: OrderStatus.PENDING,
    totalAmount: 55,
    searchText: 'Entrega urgente hoy en la tarde con empaque básico',
  },
  {
    productId: 'prod-uuid-211',
    quantity: 3,
    userId: 'user-uuid-511',
    status: OrderStatus.PENDING,
    totalAmount: 240,
    searchText: 'Entrega en la mañana con empaque de regalo premium',
  },
  {
    productId: 'prod-uuid-212',
    quantity: 2,
    userId: 'user-uuid-512',
    status: OrderStatus.PENDING,
    totalAmount: 110,
    searchText: 'Pedido sin urgencia con entrega programada en la tarde',
  },
];
