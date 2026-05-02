import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(() => {
    controller = new HealthController();
  });

  it('returns status ok and timestamp', () => {
    process.env.SERVICE_NAME = 'orders';

    const response = controller.health();

    expect(response.status).toBe('ok');
    expect(response.service).toBe('orders');
    expect(new Date(response.timestamp).toISOString()).toBe(response.timestamp);
  });

  it('uses unknown when SERVICE_NAME is not set', () => {
    delete process.env.SERVICE_NAME;

    const response = controller.health();

    expect(response.service).toBe('unknown');
  });
});
