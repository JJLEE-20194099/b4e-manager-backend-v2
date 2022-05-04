import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CertStatus } from 'src/public/enum';

export type BatchDocument = Batch & Document;

@Schema({timestamps: true})
export class Batch {
    _id: Types.ObjectId;

    @Prop({require: true, type: Types.ObjectId})
    issuerId: Types.ObjectId;

    @Prop({default: 0})
    count: number;

    @Prop({default: true})
    status: CertStatus;

    @Prop({required: true})
    uploadId: string;
}

export const BatchSchema = SchemaFactory.createForClass(Batch)