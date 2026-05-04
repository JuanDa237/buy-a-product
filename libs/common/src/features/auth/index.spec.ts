import { ApiKeyGuard, IS_PUBLIC_KEY, Public, AuthModule } from './index';

describe('auth module', () => {
  it('re-exports ApiKeyGuard, IS_PUBLIC_KEY, and Public', () => {
    expect(ApiKeyGuard).toBeDefined();
    expect(IS_PUBLIC_KEY).toBeDefined();
    expect(Public).toBeDefined();
    expect(AuthModule).toBeDefined();
  });
});
