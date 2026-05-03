import { AbstractEntity, AbstractRepository, SqlDatabaseModule } from './index';

describe('database public API', () => {
  it('re-exports SQL primitives', () => {
    expect(AbstractEntity).toBeDefined();
    expect(AbstractRepository).toBeDefined();
    expect(SqlDatabaseModule).toBeDefined();
  });
});
