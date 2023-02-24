import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ActionDocument = HydratedDocument<Action>;

@Schema({ timestamps: true })
export class Action {
  @Prop()
  user: string;

  @Prop()
  type: string;

  @Prop()
  reason: string;

  @Prop()
  description: string;

  @Prop()
  paymentDate: Date;

  @Prop()
  payedForYear: number;

  @Prop()
  payedForMonth: number;

  @Prop()
  exchange: string;

  @Prop()
  currency: string;

  @Prop()
  amount: number;

  @Prop()
  invoiceNr: string;

  @Prop()
  payer: string;

  @Prop()
  paymentReceiver: string;

  @Prop()
  nrOfPersons: number;
}

export const ActionSchema = SchemaFactory.createForClass(Action);
