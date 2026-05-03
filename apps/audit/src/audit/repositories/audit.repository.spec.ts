import { Logger } from '@nestjs/common';
import { Model } from 'mongoose';

import { AuditRepository } from './audit.repository';
import { AuditEventDocument } from '../schemas/audit-event.schema';

describe('AuditRepository', () => {
  let repository: AuditRepository;
  let model: {
    find: jest.Mock;
  };

  beforeEach(() => {
    model = {
      find: jest.fn(),
    };

    repository = new AuditRepository(
      model as unknown as Model<AuditEventDocument>,
    );
  });

  it('defines a Logger instance', () => {
    const logger = (repository as unknown as { logger: Logger }).logger;
    expect(logger).toBeInstanceOf(Logger);
  });

  it('findByOrderId filters by orderId and sorts by createdAt descending', async () => {
    const orderId = 'order-1';
    const expected = [{ orderId }] as AuditEventDocument[];
    const exec = jest.fn().mockResolvedValue(expected);
    const sort = jest.fn().mockReturnValue({ exec });

    model.find.mockReturnValue({ sort });

    await expect(repository.findByOrderId(orderId)).resolves.toEqual(expected);
    expect(model.find).toHaveBeenCalledWith({ orderId });
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(exec).toHaveBeenCalled();
  });
});
