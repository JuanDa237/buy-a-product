import 'reflect-metadata';

import { IS_PUBLIC_KEY, Public } from './public.decorator';

class TestController {
  @Public()
  handler(this: void) {
    return true;
  }
}

describe('Public', () => {
  it('marks a route handler as public', () => {
    const metadata = Reflect.getMetadata(
      IS_PUBLIC_KEY,
      TestController.prototype.handler,
    ) as boolean | undefined;

    expect(metadata).toBe(true);
  });
});
