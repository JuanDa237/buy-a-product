import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { HealthModule } from '@app/common';
import { OrdersController } from '../src/orders/controllers/orders.controller';
import { OrdersService } from '../src/orders/services/orders.service';
import { OrderStatus } from '@app/orders-common';
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
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HealthModule],
      controllers: [OrdersController],
      providers: [{ provide: OrdersService, useValue: ordersService }],
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

  describe('/orders (GET)', () => {
    it('/orders (GET) returns a list of orders', async () => {
      const responseOrders = [
        {
          id: 'f7932cad-af29-460e-938f-2ec9e57c0a33',
          productId: 'product-1',
          quantity: 2,
          userId: 'user-1',
          totalAmount: 150,
          status: OrderStatus.PENDING,
        },
        {
          id: 'a1234cad-af29-460e-938f-2ec9e57c0a33',
          productId: 'product-2',
          quantity: 1,
          userId: 'user-2',
          totalAmount: 100,
          status: OrderStatus.CONFIRMED,
        },
      ];

      ordersService.findAll.mockResolvedValue(responseOrders);

      await request(app.getHttpServer() as Server)
        .get('/orders')
        .expect(200)
        .expect(responseOrders);
    });

    it('/orders?status=INVALID_STATUS (GET) returns 400 Bad Request', async () => {
      await request(app.getHttpServer() as Server)
        .get('/orders?status=INVALID_STATUS')
        .expect(400);
    });

    it('/orders?status=PENDING (GET) returns a list of pending orders', async () => {
      const responseOrders = [
        {
          id: 'f7932cad-af29-460e-938f-2ec9e57c0a33',
          productId: 'product-1',
          quantity: 2,
          userId: 'user-1',
          totalAmount: 150,
          status: OrderStatus.PENDING,
        },
      ];

      ordersService.findAll.mockResolvedValue(responseOrders);

      await request(app.getHttpServer() as Server)
        .get('/orders?status=PENDING')
        .expect(200)
        .expect(responseOrders);
    });

    it('/orders?userId=user-1 (GET) returns a list of orders for user-1', async () => {
      const allOrders = [
        {
          id: 'f7932cad-af29-460e-938f-2ec9e57c0a33',
          productId: 'product-1',
          quantity: 2,
          userId: 'user-1',
          totalAmount: 150,
          status: OrderStatus.PENDING,
        },
        {
          id: 'a1234cad-af29-460e-938f-2ec9e57c0a33',
          productId: 'product-2',
          quantity: 1,
          userId: 'user-2',
          totalAmount: 100,
          status: OrderStatus.CONFIRMED,
        },
      ];

      const expectedFilteredOrders = allOrders.filter(
        (order) => order.userId === 'user-1',
      );

      ordersService.findAll.mockImplementation((query: { userId?: string }) =>
        allOrders.filter(
          (order) => !query.userId || order.userId === query.userId,
        ),
      );

      await request(app.getHttpServer() as Server)
        .get('/orders?userId=user-1')
        .expect(200)
        .expect(expectedFilteredOrders);

      expect(ordersService.findAll).toHaveBeenCalledTimes(1);
      expect(ordersService.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'user-1' }),
      );
    });
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
