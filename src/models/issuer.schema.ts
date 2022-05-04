import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { Role } from 'src/public/enum';

export type IssuerDocument = Issuer & Document;

@Schema()
export class Issuer {
    _id: Types.ObjectId;

    @Prop()
    name: string;

    @Prop({ unique: true })
    email: string;

    @Prop()
    phone: string;

    @Prop()
    password: string;

    @Prop()
    roles: Role[];
}

export const IssuerSchema = SchemaFactory.createForClass(Issuer);