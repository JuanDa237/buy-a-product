import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { Server } from 'http';

import { AUDIT_MICROSERVICE } from '@app/audit-common';
import { HealthModule } from '@app/common';
import { OrderStatus } from '@app/orders-common';

import { OrdersController } from '../src/orders/controllers/orders.controller';
import { OrdersService } from '../src/orders/services/orders.service';
import { OrdersRepository } from '../src/orders/repositories/orders.repository';

describe('Orders to Audit integration (e2e)', () => {
  let app: INestApplication;

  const ordersRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    updateStatus: jest.fn(),
    findAll: jest.fn(),
  };

  const auditClient = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HealthModule],
      controllers: [OrdersController],
      providers: [
        OrdersService,
        { provide: OrdersRepository, useValue: ordersRepository },
        { provide: AUDIT_MICROSERVICE, useValue: auditClient },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );

    await app.init();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('POST /orders emits order.status.changed with fromStatus=null and toStatus=PENDING', async () => {
    const orderId = 'f7932cad-af29-460e-938f-2ec9e57c0a33';
    const savedOrder = {
      id: orderId,
      productId: 'product-1',
      quantity: 2,
      userId: 'user-1',
      totalAmount: 150,
      status: OrderStatus.PENDING,
    };

    ordersRepository.create.mockResolvedValue(savedOrder);

    await request(app.getHttpServer() as Server)
      .post('/orders')
      .send({
        productId: 'product-1',
        quantity: 2,
        userId: 'user-1',
        totalAmount: 150,
      })
      .expect(201);

    expect(ordersRepository.create).toHaveBeenCalledWith({
      productId: 'product-1',
      quantity: 2,
      userId: 'user-1',
      totalAmount: 150,
      status: OrderStatus.PENDING,
    });

    expect(auditClient.emit).toHaveBeenCalledWith('order.status.changed', {
      orderId,
      fromStatus: null,
      toStatus: OrderStatus.PENDING,
    });
  });

  it('PUT /orders/:id/status emits order.status.changed with previous and new statuses', async () => {
    const orderId = 'f7932cad-af29-460e-938f-2ec9e57c0a33';
    const existingOrder = {
      id: orderId,
      productId: 'product-1',
      quantity: 2,
      userId: 'user-1',
      totalAmount: 150,
      status: OrderStatus.PENDING,
    };

    const updatedOrder = {
      ...existingOrder,
      status: OrderStatus.CONFIRMED,
    };

    ordersRepository.findById.mockResolvedValue(existingOrder);
    ordersRepository.updateStatus.mockResolvedValue(updatedOrder);

    await request(app.getHttpServer() as Server)
      .put(`/orders/${orderId}/status`)
      .send({ status: OrderStatus.CONFIRMED })
      .expect(200);

    expect(ordersRepository.findById).toHaveBeenCalledWith(orderId);
    expect(ordersRepository.updateStatus).toHaveBeenCalledWith(
      orderId,
      OrderStatus.CONFIRMED,
    );

    expect(auditClient.emit).toHaveBeenCalledWith('order.status.changed', {
      orderId,
      fromStatus: OrderStatus.PENDING,
      toStatus: OrderStatus.CONFIRMED,
    });
  });
});
