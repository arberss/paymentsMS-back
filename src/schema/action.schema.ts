import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ActionDocument = HydratedDocument<Action>;

@Schema()
export class Action {
  @Prop()
  type: string;

  @Prop()
  reason: string;

  @Prop()
  paymentDate: Date;

  @Prop()
  payedForYear: number;

  @Prop()
  payedForMonth: number;

  @Prop()
  exchange: string;

  @Prop()
  amount: number;

  @Prop()
  householdHeader: string;

  @Prop()
  payer: string;

  @Prop()
  paymentReceiver: string;

  @Prop()
  nrOfPersons: number;
}

export const ActionSchema = SchemaFactory.createForClass(Action);
