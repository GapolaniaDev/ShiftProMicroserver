import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop()
  city: string;

  @Prop()
  country: string;

  @Prop()
  avatar: string;

  @Prop()
  employeeId: string;

  @Prop()
  role: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);