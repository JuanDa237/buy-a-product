import {
  AbstractDocument,
  AbstractDocumentRepository,
  SqlDatabaseModule,
  AbstractEntityRepository,
  AbstractEntity,
  NoSqlDatabaseModule,
} from './index';

describe('database public API', () => {
  it('re-exports SQL primitives', () => {
    expect(AbstractDocument).toBeDefined();
    expect(AbstractDocumentRepository).toBeDefined();
    expect(SqlDatabaseModule).toBeDefined();
  });

  it('re-exports NoSQL primitives', () => {
    expect(AbstractEntity).toBeDefined();
    expect(AbstractEntityRepository).toBeDefined();
    expect(NoSqlDatabaseModule).toBeDefined();
  });
});
