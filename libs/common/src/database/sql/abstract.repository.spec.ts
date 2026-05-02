import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { AbstractRepository } from './abstract.repository';

class TestEntity extends AbstractEntity {
  name!: string;
}

class TestRepository extends AbstractRepository<TestEntity> {
  protected readonly logger = {
    warn: jest.fn(),
    error: jest.fn(),
    log: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
    fatal: jest.fn(),
    setLogLevels: jest.fn(),
    registerLocalInstanceRef: jest.fn(),
  } as unknown as Logger;
}

describe('AbstractRepository', () => {
  let repository: TestRepository;
  let typeormRepository: {
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
  };

  beforeEach(() => {
    typeormRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    repository = new TestRepository(
      typeormRepository as unknown as Repository<TestEntity>,
    );
  });

  it('findById returns entity when found', async () => {
    const entity = { id: 'entity-1', name: 'test' } as TestEntity;
    typeormRepository.findOne.mockResolvedValue(entity);

    await expect(repository.findById('entity-1')).resolves.toEqual(entity);
    expect(typeormRepository.findOne).toHaveBeenCalledWith({
      where: { id: 'entity-1' },
    });
  });

  it('findById throws NotFoundException when not found', async () => {
    typeormRepository.findOne.mockResolvedValue(null);

    await expect(repository.findById('missing-id')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('create persists payload and returns saved entity', async () => {
    const payload = { id: 'entity-1', name: 'test' } as TestEntity;
    typeormRepository.create.mockReturnValue(payload);
    typeormRepository.save.mockResolvedValue(payload);

    await expect(repository.create(payload)).resolves.toEqual(payload);
    expect(typeormRepository.create).toHaveBeenCalledWith(payload);
    expect(typeormRepository.save).toHaveBeenCalledWith(payload);
  });

  it('create throws BadRequestException when save returns null', async () => {
    const payload = { id: 'entity-1', name: 'test' } as TestEntity;
    typeormRepository.create.mockReturnValue(payload);
    typeormRepository.save.mockResolvedValue(null);

    await expect(repository.create(payload)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
