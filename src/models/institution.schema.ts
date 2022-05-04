import {Prop, Schema,  SchemaFactory} from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

export type InstitutionDocument = Institution & Document;


@Schema({ timestamps: true })
export class Institution {
    _id: Types.ObjectId;

    @Prop({required: true})
    name: string;

    @Prop({unique: true, required: true})
    email:string;

    @Prop({required: true})
    password:string;

    @Prop({default: "legal reference"})
    legalReference: string;

    @Prop({default: "intent declaration"})
    intentDeclaration: string;

    @Prop({required: true})
    host: string;

    @Prop()
    documentStoreAddress: string;
    
    @Prop({default: false})
    isActive: boolean;

    @Prop({required: true})
    expirationDate: Date;
}

export const InstitutionSchema = SchemaFactory.createForClass(Institution).plugin(softDeletePlugin);