import { ThrottlerModule } from './index';

describe('throttler public API', () => {
  it('re-exports throttler module', () => {
    expect(ThrottlerModule).toBeDefined();
  });
});
