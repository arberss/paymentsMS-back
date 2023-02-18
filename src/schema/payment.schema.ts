import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type PaymentDocument = HydratedDocument<Payment>;

export enum paymentsType {
  income = 'income',
  expense = 'expense',
}

export interface Payments {
  reason: string;
  paymentDate: Date;
  payedForYear: number;
  exchange: string;
  amount: number;
  householdHeader: string;
  payer: string;
  paymentReceiver: string;
}

@Schema()
export class PaymentField {
  @Prop()
  reason: string;

  @Prop()
  paymentDate: Date;

  @Prop()
  payedForYear: number;

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
}
const PaymentFieldSchema = SchemaFactory.createForClass(PaymentField);

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop([PaymentFieldSchema])
  payments: Payments[];
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
