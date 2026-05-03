import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from '../services/orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderStatus } from '@app/orders-common';

describe('OrdersController', () => {
  let ordersController: OrdersController;
  let ordersService: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    updateStatus: jest.Mock;
  };

  const orderResponse = {
    id: 'f7932cad-af29-460e-938f-2ec9e57c0a33',
    productId: 'product-1',
    quantity: 2,
    userId: 'user-1',
    totalAmount: 150,
    status: OrderStatus.PENDING,
  };

  beforeEach(async () => {
    ordersService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      updateStatus: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [{ provide: OrdersService, useValue: ordersService }],
    }).compile();

    ordersController = app.get<OrdersController>(OrdersController);
  });

  describe('create', () => {
    it('delegates to service and returns created order', async () => {
      const dto: CreateOrderDto = {
        productId: 'product-1',
        quantity: 2,
        userId: 'user-1',
        totalAmount: 150,
      };

      ordersService.create.mockResolvedValue(orderResponse);

      await expect(ordersController.create(dto)).resolves.toEqual(
        orderResponse,
      );
      expect(ordersService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('delegates to service and returns list of orders', async () => {
      const query = { status: OrderStatus.PENDING, userId: 'user-1' };
      const ordersList = [orderResponse];

      ordersService.findAll.mockResolvedValue(ordersList);

      await expect(ordersController.findAll(query)).resolves.toEqual(
        ordersList,
      );
      expect(ordersService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('delegates to service and returns a single order', async () => {
      const id = 'f7932cad-af29-460e-938f-2ec9e57c0a33';
      ordersService.findOne.mockResolvedValue(orderResponse);

      await expect(ordersController.findOne(id)).resolves.toEqual(
        orderResponse,
      );
      expect(ordersService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('updateStatus', () => {
    it('delegates to service and returns updated order', async () => {
      const id = 'f7932cad-af29-460e-938f-2ec9e57c0a33';
      const dto = { status: OrderStatus.CONFIRMED };
      const updatedOrder = { ...orderResponse, status: OrderStatus.CONFIRMED };

      ordersService.updateStatus.mockResolvedValue(updatedOrder);

      await expect(ordersController.updateStatus(id, dto)).resolves.toEqual(
        updatedOrder,
      );
      expect(ordersService.updateStatus).toHaveBeenCalledWith(id, dto);
    });
  });
});
