import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type ActionDocument = HydratedDocument<Action>;

@Schema({ timestamps: true })
export class Action {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop()
  customUserName: string;

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
  currency: string;

  @Prop()
  amount: number;

  @Prop()
  invoiceNr: string;

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
