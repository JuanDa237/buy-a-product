import { AbstractEntity } from './abstract.entity';

class TestEntity extends AbstractEntity {}

describe('AbstractEntity', () => {
  it('contains base audit fields', () => {
    const entity = new TestEntity();
    entity.id = '8f4f8abf-5ad2-4f49-85cd-2f3bf8c25250';
    entity.createdAt = new Date('2026-01-01T00:00:00.000Z');
    entity.updatedAt = new Date('2026-01-02T00:00:00.000Z');

    expect(entity.id).toBeDefined();
    expect(entity.createdAt).toBeInstanceOf(Date);
    expect(entity.updatedAt).toBeInstanceOf(Date);
  });
});
