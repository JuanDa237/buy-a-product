import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

import { ApiKeyGuard } from './api-key.guard';

describe('ApiKeyGuard', () => {
  let configService: jest.Mocked<Pick<ConfigService, 'get'>>;
  let reflector: jest.Mocked<Pick<Reflector, 'getAllAndOverride'>>;
  let guard: ApiKeyGuard;

  beforeEach(() => {
    configService = {
      get: jest.fn(),
    };

    reflector = {
      getAllAndOverride: jest.fn(),
    };

    guard = new ApiKeyGuard(
      configService as unknown as ConfigService,
      reflector as unknown as Reflector,
    );
  });

  it('allows non-http contexts', () => {
    const context = {
      getType: () => 'rpc',
    } as unknown as ExecutionContext;

    expect(guard.canActivate(context)).toBe(true);
    expect(reflector.getAllAndOverride).not.toHaveBeenCalled();
    expect(configService.get).not.toHaveBeenCalled();
  });

  it('allows public routes', () => {
    reflector.getAllAndOverride.mockReturnValue(true);

    const context = {
      getType: () => 'http',
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;

    expect(guard.canActivate(context)).toBe(true);
    expect(configService.get).not.toHaveBeenCalled();
  });

  it('throws when the server api key is not configured', () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    configService.get.mockReturnValue(undefined);

    const context = createHttpContext();

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(context)).toThrow(
      'API key not configured on the server',
    );
  });

  it('throws when the request api key is missing', () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    configService.get.mockReturnValue('expected-key');

    const context = createHttpContext();

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(context)).toThrow(
      'Invalid or missing API key',
    );
  });

  it('throws when the request api key is invalid', () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    configService.get.mockReturnValue('expected-key');

    const context = createHttpContext('wrong-key');

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(context)).toThrow(
      'Invalid or missing API key',
    );
  });

  it('allows requests with a valid api key', () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    configService.get.mockReturnValue('expected-key');

    const context = createHttpContext('expected-key');

    expect(guard.canActivate(context)).toBe(true);
  });
});

function createHttpContext(apiKey?: string): ExecutionContext {
  return {
    getType: () => 'http',
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => ({
        headers: apiKey ? { 'x-api-key': apiKey } : {},
      }),
    }),
  } as unknown as ExecutionContext;
}
