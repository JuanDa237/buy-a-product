import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { HealthModule } from '@app/common';
import { OrdersController } from '../src/orders/controllers/orders.controller';
import { OrdersService } from '../src/orders/services/orders.service';
import { OrderStatus } from '../src/orders/enums/order-status.enum';
import { Server } from 'http';

interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
}

describe('OrdersController (e2e)', () => {
  let app: INestApplication;
  const ordersService = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HealthModule],
      controllers: [OrdersController],
      providers: [{ provide: OrdersService, useValue: ordersService }],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET) returns health payload', async () => {
    const response = await request(app.getHttpServer() as Server)
      .get('/')
      .expect(200);

    const body = response.body as HealthResponse;

    expect(body.status).toBe('ok');
    expect(body).toHaveProperty('service');
    expect(typeof body.service).toBe('string');
    expect(new Date(body.timestamp).toISOString()).toBe(body.timestamp);
  });

  it('/orders (POST) creates an order', async () => {
    const responseOrder = {
      id: 'f7932cad-af29-460e-938f-2ec9e57c0a33',
      productId: 'product-1',
      quantity: 2,
      userId: 'user-1',
      totalAmount: 150,
      status: OrderStatus.PENDING,
    };

    ordersService.create.mockResolvedValue(responseOrder);

    await request(app.getHttpServer() as Server)
      .post('/orders')
      .send({
        productId: 'product-1',
        quantity: 2,
        userId: 'user-1',
        totalAmount: 150,
      })
      .expect(201)
      .expect(responseOrder);
  });

  it('/orders/:id (GET) returns an order', async () => {
    const id = 'f7932cad-af29-460e-938f-2ec9e57c0a33';
    const responseOrder = {
      id,
      productId: 'product-1',
      quantity: 2,
      userId: 'user-1',
      totalAmount: 150,
      status: OrderStatus.PENDING,
    };

    ordersService.findOne.mockResolvedValue(responseOrder);

    await request(app.getHttpServer() as Server)
      .get(`/orders/${id}`)
      .expect(200)
      .expect(responseOrder);
  });
});
