import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, trim: true, maxlength: 100 })
  name: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
    maxlength: 100,
  })
  email: string;

  @Prop({ required: true, trim: true, maxlength: 100, minLength: 6 })
  passwordHash: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
