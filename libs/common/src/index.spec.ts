import {
  AUDIT_SERVICE,
  ORDERS_SERVICE,
  HealthController,
  HealthModule,
  NoSqlDatabaseModule,
  SqlDatabaseModule,
} from '.';

describe('common public API', () => {
  it('re-exports constants and health feature', () => {
    expect(ORDERS_SERVICE).toBe('ORDERS_SERVICE');
    expect(AUDIT_SERVICE).toBe('AUDIT_SERVICE');
    expect(HealthController).toBeDefined();
    expect(HealthModule).toBeDefined();
    expect(SqlDatabaseModule).toBeDefined();
    expect(NoSqlDatabaseModule).toBeDefined();
  });
});
