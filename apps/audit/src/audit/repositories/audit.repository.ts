import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AuditEventDocument } from '../schemas/audit-event.schema';
import { AbstractDocumentRepository } from '@app/common';

@Injectable()
export class AuditRepository extends AbstractDocumentRepository<AuditEventDocument> {
  protected readonly logger: Logger = new Logger(AuditRepository.name);

  constructor(
    @InjectModel(AuditEventDocument.name)
    auditModel: Model<AuditEventDocument>,
  ) {
    super(auditModel);
  }

  async findByOrderId(orderId: string): Promise<AuditEventDocument[]> {
    return this.model.find({ orderId }).sort({ createdAt: -1 }).exec();
  }
}
