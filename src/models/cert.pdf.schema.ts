import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CertPdfDocument = CertPdf & Document;

@Schema({timestamps: true})
export class CertPdf {
    _id: Types.ObjectId;
    
    @Prop({required: true})
    studentId: string;

    @Prop({required: true})
    institutionId: string;

    @Prop({required: true})
    pdfString: string;

    @Prop({required: true})
    noBackgroundPdfString:string

    @Prop({required: true})
    type: string;    
}

export const CertPdfSchema = SchemaFactory.createForClass(CertPdf);
