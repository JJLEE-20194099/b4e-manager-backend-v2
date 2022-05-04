import {TemplateService} from '../services/template.service';
import {Controller, Post, Body, Param, HttpCode, HttpStatus, HttpException, Get, Request, Patch, Delete, UseInterceptors} from '@nestjs/common';
import {TemplateDto} from '../dto/template.dto';
import {TemplateUpdateDto} from '../dto/templateUpdate.dto';
import {Template} from 'src/models/template.schema';
import {Types} from 'mongoose';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';


@Controller('template')
export class TemplateController {
    constructor(private templateService: TemplateService){}
    @Post('upload')  
    async upload(@Body() templateDto: TemplateDto) {

        await this.templateService.upload(templateDto);
    }

    @Get('/:templateId')
    async getTemplateById(@Param('templateId') id:string): Promise<Template> {
        return await this.templateService.findById(id);
    }

    @Get('find-by-id-and-type/:institutionId/:type')
    async getTemplateByName(@Param('institutionId') institutionId: string, @Param('type') type: string): Promise<Template> {
        return await this.templateService.findByInstitutionIdAndType(institutionId, type);
    } 

    @Patch('update/:templateId')
    async update(@Param('templateId') id:string, @Body() updateTemplateDto: TemplateUpdateDto) {
        return await this.templateService.update(new Types.ObjectId(id), updateTemplateDto)
    }

    @Patch('soft-delete/:id')
    async softDelete(@Param('id') id:string) {
        return await this.templateService.softDelete(new Types.ObjectId(id));
    }

    @Patch('restore/:id')
    async restore(@Param('id') id:string) {
        return await this.templateService.restore(new Types.ObjectId(id));
    }
}