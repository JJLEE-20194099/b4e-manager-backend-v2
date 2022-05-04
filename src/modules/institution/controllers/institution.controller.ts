import { InstitutionService } from '../services/institution.service';

import { Controller, Post, Body, Param, HttpCode, HttpStatus, HttpException, Get, Request, Patch, Delete} from '@nestjs/common';
import { InstitutionDto } from 'src/modules/institution/dto/institution.dto';
import { InstitutionUpdateDto } from 'src/modules/institution/dto/institutionUpdate.dto';
import { Institution } from 'src/models/institution.schema';
import { InstitutionFilterDto } from 'src/modules/institution/dto/institutionFilter.dto'; 
import { Types } from 'mongoose';

@Controller('institution')
export class InstitutionController {

    constructor(private institutionService: InstitutionService){}

    @Post('register')
    async create(@Body() createInstitutionDto: InstitutionDto) {
        await this.institutionService.create(createInstitutionDto);
    }

    @Get('list')
    async findAll() {
        return this.institutionService.findAll();
    }

    @Get('find-by-id/:id')
    async findOne(@Param('id') id:string): Promise<Institution> {
        return await this.institutionService.findOne(id);
    }

    @Patch('update/:id')
    async update(@Param('id') id:string, @Body() updatedInstitutionDto: InstitutionUpdateDto) {
        return await this.institutionService.update(new Types.ObjectId(id), updatedInstitutionDto)
    }

    @Patch('soft-delete/:id')
    async softDelete(@Param('id') id:string) {
        return await this.institutionService.softDelete(new Types.ObjectId(id));
    }

    @Patch('restore/:id')
    async restore(@Param('id') id:string) {
        return await this.institutionService.restore(new Types.ObjectId(id));
    }

    @Patch('deactive/:id')
    async deactive(@Param('id') id:string): Promise<Institution> {
        return await this.institutionService.deactive(id);
    }

    @Patch('reactive/:id')
    async reactive(@Param('id') id:string): Promise<Institution> {
        return await this.institutionService.reactive(id);
    }

    @Delete('delete/:id')
    async delete(@Param('id') id:string): Promise<Institution> {
        return await this.institutionService.delete(id);
    }

    @Get('find-by-email')
    async findByEmail(@Request() req): Promise<Institution> {
        return await this.institutionService.findByEmail(req.user.email);
    }

    @Get('active-list')
    async findActiveAll(): Promise<Institution[]> {
        return await this.institutionService.findActiveAll();
    }


}
