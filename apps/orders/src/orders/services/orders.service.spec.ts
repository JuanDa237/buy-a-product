import { OrdersService } from './orders.service';
import { OrdersRepository } from '../repositories/orders.repository';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderStatus } from '../enums/order-status.enum';

describe('OrdersService', () => {
  let service: OrdersService;
  let ordersRepository: {
    create: jest.Mock;
    findById: jest.Mock;
    updateStatus: jest.Mock;
  };

  beforeEach(() => {
    ordersRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      updateStatus: jest.fn(),
    };

    service = new OrdersService(
      ordersRepository as unknown as OrdersRepository,
    );
  });

  it('create sets status as PENDING and delegates to repository', async () => {
    const dto: CreateOrderDto = {
      productId: 'product-1',
      quantity: 2,
      userId: 'user-1',
      totalAmount: 150,
    };

    const saved = {
      ...dto,
      id: 'f7932cad-af29-460e-938f-2ec9e57c0a33',
      status: OrderStatus.PENDING,
    };

    ordersRepository.create.mockResolvedValue(saved);

    await expect(service.create(dto)).resolves.toEqual(saved);
    expect(ordersRepository.create).toHaveBeenCalledWith({
      ...dto,
      status: OrderStatus.PENDING,
    });
  });

  it('findOne delegates to repository findById', async () => {
    const id = 'f7932cad-af29-460e-938f-2ec9e57c0a33';
    const order = {
      id,
      productId: 'product-1',
      quantity: 2,
      userId: 'user-1',
      totalAmount: 150,
      status: OrderStatus.PENDING,
    };

    ordersRepository.findById.mockResolvedValue(order);

    await expect(service.findOne(id)).resolves.toEqual(order);
    expect(ordersRepository.findById).toHaveBeenCalledWith(id);
  });

  describe('updateStatus', () => {
    it('updateStatus validates status transition and updates', async () => {
      const id = 'f7932cad-af29-460e-938f-2ec9e57c0a33';
      const existingOrder = {
        id,
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

      await expect(
        service.updateStatus(id, { status: updatedOrder.status }),
      ).resolves.toEqual(updatedOrder);

      expect(ordersRepository.findById).toHaveBeenCalledWith(id);
      expect(ordersRepository.updateStatus).toHaveBeenCalledWith(
        id,
        updatedOrder.status,
      );
    });

    it('updateStatus throws BadRequestException for invalid transition', async () => {
      const id = 'f7932cad-af29-460e-938f-2ec9e57c0a33';
      const existingOrder = {
        id,
        productId: 'product-1',
        quantity: 2,
        userId: 'user-1',
        totalAmount: 150,
        status: OrderStatus.PENDING,
      };

      ordersRepository.findById.mockResolvedValue(existingOrder);

      await expect(
        service.updateStatus(id, { status: OrderStatus.SHIPPED }),
      ).rejects.toThrow(
        `Invalid status transition from "${existingOrder.status}" to "${OrderStatus.SHIPPED}". Allowed: [${[OrderStatus.CONFIRMED, OrderStatus.CANCELED].join(', ')}]`,
      );

      expect(ordersRepository.findById).toHaveBeenCalledWith(id);
      expect(ordersRepository.updateStatus).not.toHaveBeenCalled();
    });

    it('updateStatus throws BadRequestException if repository update fails', async () => {
      const id = 'f7932cad-af29-460e-938f-2ec9e57c0a33';
      const existingOrder = {
        id,
        productId: 'product-1',
        quantity: 2,
        userId: 'user-1',
        totalAmount: 150,
        status: OrderStatus.PENDING,
      };

      ordersRepository.findById.mockResolvedValue(existingOrder);
      ordersRepository.updateStatus.mockResolvedValue(null);

      await expect(
        service.updateStatus(id, { status: OrderStatus.CONFIRMED }),
      ).rejects.toThrow(`Order with id ${id} not found for status update`);

      expect(ordersRepository.findById).toHaveBeenCalledWith(id);
      expect(ordersRepository.updateStatus).toHaveBeenCalledWith(
        id,
        OrderStatus.CONFIRMED,
      );
    });
  });
});
