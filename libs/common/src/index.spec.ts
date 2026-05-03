import {
  HealthController,
  HealthModule,
  NoSqlDatabaseModule,
  SqlDatabaseModule,
} from '.';

describe('common public API', () => {
  it('re-exports constants and health feature', () => {
    expect(HealthController).toBeDefined();
    expect(HealthModule).toBeDefined();
    expect(SqlDatabaseModule).toBeDefined();
    expect(NoSqlDatabaseModule).toBeDefined();
  });
});
