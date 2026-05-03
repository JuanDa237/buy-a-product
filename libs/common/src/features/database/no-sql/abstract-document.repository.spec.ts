import { Logger, NotFoundException } from '@nestjs/common';
import { Model, Types, UpdateQuery } from 'mongoose';

import { AbstractDocumentRepository } from './abstract-document.repository';
import { AbstractDocument } from './abstract.schema';

interface TestDocument extends AbstractDocument {
  name: string;
}

type CreatePayload = Omit<TestDocument, '_id'> & { _id: Types.ObjectId };

class TestRepository extends AbstractDocumentRepository<TestDocument> {
  protected readonly logger = {
    warn: jest.fn(),
  } as unknown as Logger;
}

describe('AbstractDocumentRepository', () => {
  let repository: TestRepository;

  let model: {
    findOne: jest.Mock;
    findOneAndUpdate: jest.Mock;
    find: jest.Mock;
    findOneAndDelete: jest.Mock;
  } & jest.Mock;
  let saveMock: jest.Mock;
  let createPayloads: CreatePayload[];

  beforeEach(() => {
    saveMock = jest.fn();
    createPayloads = [];

    model = jest.fn().mockImplementation((payload: CreatePayload) => {
      createPayloads.push(payload);

      return {
        save: saveMock,
      };
    }) as unknown as {
      findOne: jest.Mock;
      findOneAndUpdate: jest.Mock;
      find: jest.Mock;
      findOneAndDelete: jest.Mock;
    } & jest.Mock;

    model.findOne = jest.fn();
    model.findOneAndUpdate = jest.fn();
    model.find = jest.fn();
    model.findOneAndDelete = jest.fn();

    repository = new TestRepository(model as unknown as Model<TestDocument>);
  });

  it('creates a document with generated _id and returns serialized result', async () => {
    const input: Omit<TestDocument, '_id'> = { name: 'sample' };
    const saved: TestDocument = {
      _id: new Types.ObjectId(),
      name: input.name,
    };

    saveMock.mockResolvedValue({
      toJSON: () => saved,
    });

    await expect(repository.create(input)).resolves.toEqual(saved);

    expect(model).toHaveBeenCalledTimes(1);
    expect(model).toHaveBeenCalledWith(
      expect.objectContaining({
        name: input.name,
      }),
    );
    expect(createPayloads).toHaveLength(1);
    expect(createPayloads[0]._id).toBeInstanceOf(Types.ObjectId);
    expect(saveMock).toHaveBeenCalledTimes(1);
  });

  it('findOne returns a document using lean query', async () => {
    const filter = { name: 'sample' };
    const found: TestDocument = { _id: new Types.ObjectId(), name: 'sample' };
    const lean = jest.fn().mockResolvedValue(found);

    model.findOne.mockReturnValue({ lean });

    await expect(repository.findOne(filter)).resolves.toEqual(found);
    expect(model.findOne).toHaveBeenCalledWith(filter);
    expect(lean).toHaveBeenCalledWith(true);
  });

  it('findOne throws NotFoundException and logs warning when document does not exist', async () => {
    const filter = { name: 'missing' };
    const lean = jest.fn().mockResolvedValue(null);
    const warn = (repository as unknown as { logger: { warn: jest.Mock } })
      .logger.warn;

    model.findOne.mockReturnValue({ lean });

    await expect(repository.findOne(filter)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(warn).toHaveBeenCalledWith(
      'Document was not found with filter in findOne',
      filter,
    );
  });

  it('findOneAndUpdate returns updated document with { new: true } option', async () => {
    const filter = { name: 'sample' };
    const update: UpdateQuery<TestDocument> = { $set: { name: 'updated' } };
    const updated: TestDocument = {
      _id: new Types.ObjectId(),
      name: 'updated',
    };
    const lean = jest.fn().mockResolvedValue(updated);

    model.findOneAndUpdate.mockReturnValue({ lean });

    await expect(repository.findOneAndUpdate(filter, update)).resolves.toEqual(
      updated,
    );
    expect(model.findOneAndUpdate).toHaveBeenCalledWith(filter, update, {
      new: true,
    });
    expect(lean).toHaveBeenCalledWith(true);
  });

  it('findOneAndUpdate throws NotFoundException when document does not exist', async () => {
    const filter = { name: 'missing' };
    const update: UpdateQuery<TestDocument> = { $set: { name: 'updated' } };
    const lean = jest.fn().mockResolvedValue(null);
    const warn = (repository as unknown as { logger: { warn: jest.Mock } })
      .logger.warn;

    model.findOneAndUpdate.mockReturnValue({
      lean,
    });

    await expect(
      repository.findOneAndUpdate(filter, update),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(warn).toHaveBeenCalledWith(
      'Document was not found with filter in findOneAndUpdate',
      filter,
    );
  });

  it('find returns matching documents using lean query', async () => {
    const filter = { name: 'sample' };
    const results: TestDocument[] = [
      { _id: new Types.ObjectId(), name: 'sample-1' },
      { _id: new Types.ObjectId(), name: 'sample-2' },
    ];
    const lean = jest.fn().mockResolvedValue(results);

    model.find.mockReturnValue({ lean });

    await expect(repository.find(filter)).resolves.toEqual(results);
    expect(model.find).toHaveBeenCalledWith(filter);
    expect(lean).toHaveBeenCalledWith(true);
  });

  it('findOneAndDelete returns deleted document', async () => {
    const filter = { name: 'sample' };
    const deleted: TestDocument = { _id: new Types.ObjectId(), name: 'sample' };
    const lean = jest.fn().mockResolvedValue(deleted);

    model.findOneAndDelete.mockReturnValue({
      lean,
    });

    await expect(repository.findOneAndDelete(filter)).resolves.toEqual(deleted);
    expect(model.findOneAndDelete).toHaveBeenCalledWith(filter);
    expect(lean).toHaveBeenCalledWith(true);
  });

  it('findOneAndDelete throws NotFoundException when no document is deleted', async () => {
    const filter = { name: 'missing' };
    const lean = jest.fn().mockResolvedValue(null);
    const warn = (repository as unknown as { logger: { warn: jest.Mock } })
      .logger.warn;

    model.findOneAndDelete.mockReturnValue({
      lean,
    });

    await expect(repository.findOneAndDelete(filter)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(warn).toHaveBeenCalledWith(
      'Document was not found with filter in findOneAndDelete',
      filter,
    );
  });
});
