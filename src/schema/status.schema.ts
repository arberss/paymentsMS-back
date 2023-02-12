import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type StatusDocument = HydratedDocument<Status>;

@Schema()
export class Status {
  @Prop()
  name: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
  users: string[];
}

export const StatusSchema = SchemaFactory.createForClass(Status);
