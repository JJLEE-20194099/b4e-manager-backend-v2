import {Prop, Schema,  SchemaFactory} from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

export type TemplateDocument = Template & Document;


@Schema({ timestamps: true })
export class Template {
    _id: Types.ObjectId;

    @Prop({required: true})
    institutionId: string;

    @Prop({required: true})
    type:string;

    @Prop({required: true})
    templatePdfString:string;
}

export const TemplateSchema = SchemaFactory.createForClass(Template).plugin(softDeletePlugin);