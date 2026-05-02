import { HealthController, HealthModule } from './index';

describe('health public API', () => {
  it('re-exports health module and controller', () => {
    expect(HealthController).toBeDefined();
    expect(HealthModule).toBeDefined();
  });
});
