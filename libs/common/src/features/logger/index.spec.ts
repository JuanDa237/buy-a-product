import { LoggerModule } from './index';

describe('logger public API', () => {
  it('re-exports logger module', () => {
    expect(LoggerModule).toBeDefined();
  });
});
