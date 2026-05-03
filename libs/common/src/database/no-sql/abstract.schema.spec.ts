import { SchemaFactory } from '@nestjs/mongoose';
import { Schema } from '@nestjs/mongoose';

import { AbstractDocument } from './abstract.schema';

@Schema()
class ConcreteDocument extends AbstractDocument {}

describe('AbstractDocument', () => {
  it('builds a schema with an ObjectId _id field', () => {
    const schema = SchemaFactory.createForClass(ConcreteDocument);
    const idPath = schema.path('_id') as { instance: string } | undefined;

    expect(schema).toBeDefined();
    expect(idPath).toBeDefined();
    expect(idPath?.instance).toBe('ObjectId');
  });
});
