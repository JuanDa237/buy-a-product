import { AbstractDocument } from '@app/common/features/database/no-sql/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'audit_events',
  timestamps: true,
  versionKey: false,
})
export class AuditEventDocument extends AbstractDocument {
  @Prop({ required: true, index: true })
  orderId!: string;

  @Prop({ type: String, default: null })
  fromStatus!: string | null;

  @Prop({ required: true })
  toStatus!: string;

  @Prop({ type: Object, default: {} })
  metadata!: Record<string, unknown>;
}

export const AuditEventSchema =
  SchemaFactory.createForClass(AuditEventDocument);
