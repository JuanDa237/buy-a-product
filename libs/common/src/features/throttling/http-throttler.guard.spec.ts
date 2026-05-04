import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ThrottlerModuleOptions } from '@nestjs/throttler/dist/throttler-module-options.interface';
import { ThrottlerStorage } from '@nestjs/throttler/dist/throttler-storage.interface';

import { HttpThrottlerGuard } from './http-throttler.guard';

describe('HttpThrottlerGuard', () => {
  let guard: HttpThrottlerGuard;

  let options: ThrottlerModuleOptions;
  let storageService: ThrottlerStorage;
  let reflector: Reflector;

  beforeEach(() => {
    options = { throttlers: [{ ttl: 60000, limit: 10 }] };
    storageService = {} as ThrottlerStorage;
    reflector = new Reflector();

    guard = new HttpThrottlerGuard(options, storageService, reflector);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('skips throttling for non-http contexts', async () => {
    const parentShouldSkip = jest.spyOn(
      ThrottlerGuard.prototype as unknown as {
        shouldSkip: (context: ExecutionContext) => Promise<boolean>;
      },
      'shouldSkip',
    );

    const context = {
      getType: () => 'rpc',
    } as unknown as ExecutionContext;

    const result = await (
      guard as unknown as {
        shouldSkip: (ctx: ExecutionContext) => Promise<boolean>;
      }
    ).shouldSkip(context);

    expect(result).toBe(true);
    expect(parentShouldSkip).not.toHaveBeenCalled();
  });

  it('delegates to ThrottlerGuard for http contexts', async () => {
    const parentShouldSkip = jest
      .spyOn(
        ThrottlerGuard.prototype as unknown as {
          shouldSkip: (context: ExecutionContext) => Promise<boolean>;
        },
        'shouldSkip',
      )
      .mockResolvedValue(false);

    const context = {
      getType: () => 'http',
    } as unknown as ExecutionContext;

    const result = await (
      guard as unknown as {
        shouldSkip: (ctx: ExecutionContext) => Promise<boolean>;
      }
    ).shouldSkip(context);

    expect(result).toBe(false);
    expect(parentShouldSkip).toHaveBeenCalledWith(context);
  });
});
