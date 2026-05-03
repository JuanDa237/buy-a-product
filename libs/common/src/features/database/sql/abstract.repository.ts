import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';

import { AbstractEntity } from './abstract.entity';
import { FindOptionsWhere, Repository } from 'typeorm';

export abstract class AbstractRepository<TDoc extends AbstractEntity> {
  protected abstract readonly logger: Logger;

  constructor(public readonly repo: Repository<TDoc>) {}

  async findById(id: string): Promise<TDoc> {
    const entity = await this.repo.findOne({
      where: { id } as FindOptionsWhere<TDoc>,
    });

    if (!entity) {
      this.logger.warn(`Entity with id ${id} not found`);
      throw new NotFoundException('Entity was not found');
    }

    return entity;
  }

  async create(data: TDoc): Promise<TDoc> {
    const payload = this.repo.create(data);

    const entity = await this.repo.save(payload);

    if (!entity) {
      this.logger.error(
        `Failed to create entity with data ${JSON.stringify(data)}`,
      );
      throw new BadRequestException('Failed to create entity');
    }

    return entity;
  }
}
