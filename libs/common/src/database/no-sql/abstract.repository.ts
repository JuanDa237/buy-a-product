import { Model, Types, UpdateQuery } from 'mongoose';
import type { QueryFilter } from 'mongoose';
import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractDocument } from './abstract.schema';

export abstract class AbstractRepository<TDoc extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDoc>) {}

  /**
   * Create and persist a new document in the underlying collection.
   *
   * The method accepts a partial document with the `_id` omitted, generates a new ObjectId
   * for the `_id` field, constructs a model instance, persists it to the database, and
   * returns the saved document as a plain JSON object typed as TDoc.
   *
   * @remarks
   * - The provided `document` must not include an `_id`; one will be generated automatically.
   * - The returned value is the result of the model instance's `save()` converted to JSON.
   *
   * @param document - The document to create (without an `_id`).
   * @returns A Promise that resolves to the created document typed as TDoc.
   * @throws Will propagate any error thrown by the underlying model's save operation (e.g., validation or connection errors).
   */
  async create(document: Omit<TDoc, '_id'>): Promise<TDoc> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });

    return (await createdDocument.save()).toJSON();
  }

  /**
   * Finds a single document that matches the provided filter and returns it as a plain JavaScript object.
   *
   * @param queryFilter - The Mongoose filter query used to locate the document (QueryFilter<TDoc>).
   * @returns A Promise that resolves to the found document typed as TDoc.
   * @throws {NotFoundException} If no document matches the provided filter.
   * @remarks
   * - Uses `this.model.findOne(queryFilter).lean<TDoc>(true)` to return a lean (non-Mongoose) object.
   * - Logs a warning with `this.logger.warn` when a document is not found.
   * - Other errors from the underlying model/query (e.g., database errors) may be propagated.
   */
  async findOne(queryFilter: QueryFilter<TDoc>): Promise<TDoc> {
    const document = await this.model.findOne(queryFilter).lean<TDoc>(true);

    if (!document) {
      this.logger.warn(
        `Document was not found with filter in findOne`,
        queryFilter,
      );
      throw new NotFoundException('Document was not found');
    }

    return document;
  }

  /**
   * Finds a single document matching the provided filter, applies the update, and returns the updated document.
   *
   * @typeParam TDoc - The document type returned by the repository.
   * @param queryFilter - Mongoose filter used to locate the document to update.
   * @param update - Mongoose update query to apply to the matched document.
   * @returns A promise that resolves to the updated document as a plain JavaScript object (lean) of type TDoc.
   * @throws NotFoundException If no document matches the provided filter (a warning is also logged with the filter).
   * @throws Error Propagates underlying Mongoose/database errors.
   *
   * @remarks
   * - Internally uses model.findOneAndUpdate with the option { new: true } to return the updated document.
   * - Calls .lean(true) so the returned value is a POJO rather than a Mongoose Document.
   */
  async findOneAndUpdate(
    queryFilter: QueryFilter<TDoc>,
    update: UpdateQuery<TDoc>,
  ): Promise<TDoc> {
    const document = await this.model
      .findOneAndUpdate(queryFilter, update, { new: true })
      .lean<TDoc>(true);

    if (!document) {
      this.logger.warn(
        `Document was not found with filter in findOneAndUpdate`,
        queryFilter,
      );
      throw new NotFoundException('Document was not found');
    }

    return document;
  }

  /**
   * Finds documents that match the provided filter and returns them as plain JavaScript objects.
   *
   * This method executes a Mongoose `find` with `.lean(true)`, so the results are plain objects
   * (not Mongoose Document instances) and Mongoose middleware, getters/setters, and virtuals are not applied.
   *
   * @template TDoc - The document type returned by the query.
   * @param queryFilter - A Mongoose filter describing which documents to match. An empty filter will match all documents.
   * @returns A promise that resolves to an array of matching documents as plain objects.
   * @throws Rejects the promise if the underlying database query fails (e.g., connection or query errors).
   */
  async find(queryFilter: QueryFilter<TDoc>): Promise<TDoc[]> {
    return this.model.find(queryFilter).lean<TDoc[]>(true);
  }

  /**
   * Finds and deletes a single document matching the provided filter.
   *
   * Performs a findOneAndDelete operation and returns a lean (plain JavaScript) representation
   * of the deleted document. If no document is found, the method logs a warning and throws a
   * NotFoundException.
   *
   * @template TDoc - The document type returned by the repository.
   * @param queryFilter - QueryFilter<TDoc> used to locate the document to delete.
   * @returns Promise<TDoc> - A promise that resolves with the deleted document.
   * @throws NotFoundException - Thrown when no document matches the provided filter.
   */
  async findOneAndDelete(queryFilter: QueryFilter<TDoc>): Promise<TDoc> {
    const document = await this.model
      .findOneAndDelete(queryFilter)
      .lean<TDoc>(true);

    if (!document) {
      this.logger.warn(
        `Document was not found with filter in findOneAndDelete`,
        queryFilter,
      );
      throw new NotFoundException('Document was not found');
    }

    return document;
  }
}
