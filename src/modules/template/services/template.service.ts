import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {Model, Types } from 'mongoose';
import { Template, TemplateDocument, TemplateSchema } from 'src/models/template.schema';
import {TemplateDto} from 'src/modules/template/dto/template.dto';
import { TemplateUpdateDto } from 'src/modules/template/dto/templateUpdate.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class TemplateService {
    constructor(
        @InjectModel(Template.name) private TemplateModel: SoftDeleteModel<TemplateDocument>,
    ){}

    async upload(templateDto: TemplateDto): Promise<Template> {
        const template = new this.TemplateModel(templateDto);
        return template.save();
    }

    async update(id: Types.ObjectId, updateTemplateDto: TemplateUpdateDto) {
        const template = await this.TemplateModel.findById(id).exec();
        for (const key in updateTemplateDto) {
            template[key] = updateTemplateDto[key];
        }
        const newTemplate = await this.TemplateModel.findByIdAndUpdate(id, template).setOptions({new:true, overwrite:true}).exec();
        return newTemplate;
    } 

    async findById(id: string): Promise<Template> {
        const template = await this.TemplateModel.findOne(Types.ObjectId(id)).exec();
        return template;
    }

    async findByInstitutionIdAndType(institutionId: string, type: string): Promise<Template> {
        const template = await this.TemplateModel.findOne({institutionId: institutionId, type: type}).exec();
        return template;
    }

    async softDelete(id: Types.ObjectId) {
        const filter = {_id: id.toString()};
        const softDeletedTemplate = await this.TemplateModel.softDelete(filter)
        return softDeletedTemplate;
    }

    async restore(id: Types.ObjectId) {
        const filter = {_id: id.toString()};
        const restoredTemplate = await this.TemplateModel.restore(filter)
        return restoredTemplate;
    }

}