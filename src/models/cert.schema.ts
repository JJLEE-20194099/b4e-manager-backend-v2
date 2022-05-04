import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CertDocument = Cert & Document;

@Schema({timestamps: true})
export class Cert {
    _id: Types.ObjectId;
    
    @Prop({required: true})
    studentId: string;

    @Prop({required: true})
    name: string;

    @Prop({required: true})
    dob:string;

    @Prop({required: true})
    testDate: string
    
    @Prop({required: true})
    validateDate: string;

    @Prop({default: -1})
    listening: Number;

    @Prop({default: -1})
    speaking: Number;

    @Prop({default: -1})
    reading: Number;

    @Prop({default: -1})
    writing: Number;

    @Prop({default: -1})
    totalScore: Number;

    @Prop({default: true})
    status: string

    @Prop({type: Types.ObjectId, ref: "batches"})
    batchId: Types.ObjectId

    @Prop({type: Types.ObjectId, ref: "issuers"})
    issuerId: Types.ObjectId;

    @Prop()
    fileName: string;

    @Prop()
    email: string;

    @Prop()
    uploadId: string;
    
}

export const CertSchema = SchemaFactory.createForClass(Cert);
