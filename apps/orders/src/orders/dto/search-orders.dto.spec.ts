import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { SearchOrdersDto } from './search-orders.dto';

describe('SearchOrdersDto', () => {
  it('is valid with correct payload', async () => {
    const dto = plainToInstance(SearchOrdersDto, {
      q: 'entrega tarde',
      page: 1,
      limit: 10,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('fails when q is empty', async () => {
    const dto = plainToInstance(SearchOrdersDto, {
      q: '',
      page: 1,
      limit: 10,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('q');
  });

  it('fails when q contains only spaces', async () => {
    const dto = plainToInstance(SearchOrdersDto, {
      q: '   ',
      page: 1,
      limit: 10,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('q');
  });

  it('fails when page is less than 1', async () => {
    const dto = plainToInstance(SearchOrdersDto, {
      q: 'regalo',
      page: 0,
      limit: 10,
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('page');
  });
});
