import { Injectable, HttpException, HttpStatus} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Institution, InstitutionDocument, InstitutionSchema } from 'src/models/institution.schema';
import { InstitutionDto } from 'src/modules/institution/dto/institution.dto';
import { InstitutionFilterDto } from 'src/modules/institution/dto/institutionFilter.dto';
import { InstitutionUpdateDto } from 'src/modules/institution/dto/institutionUpdate.dto';
import * as bcrypt from 'bcrypt';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class InstitutionService {
    constructor(
       @InjectModel(Institution.name) private InstitutionModel: SoftDeleteModel<InstitutionDocument>,
    ) {}

    async create(institutionDto: InstitutionDto): Promise<Institution> {
        const createdInstitution = new this.InstitutionModel(institutionDto)
        return createdInstitution.save()
    }

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 12);
    }
    
    async findAll(): Promise<Institution[]> {
        return this.InstitutionModel.find().exec()
    }

    async findActiveAll(): Promise<Institution[]> {
        const filter = {
            isActive: true
        }
        const institutions = await this.InstitutionModel.find(filter).exec();
        return institutions;
    }

    async findOne(id: Types.ObjectId): Promise<Institution> {
        const institution = await this.InstitutionModel.findById(id).exec();
        return institution;
    }

    async findByEmail(email: string): Promise<Institution> {
        const institution = await this.InstitutionModel.findOne({email: email}).exec()
        return institution
    }

    async findByFilter(filter: InstitutionFilterDto): Promise<Institution[]> {
        const institutions = await this.InstitutionModel.find(filter).exec();
        return institutions;
    }

    async update(id: Types.ObjectId, data: InstitutionUpdateDto): Promise<Institution> {
        const institution = await this.InstitutionModel.findById(id).exec();
        for (const key in data) {
            if (key !== "password") {
                institution[key] = data[key];
            } else {
                institution[key] = await this.hashPassword(data[key])
            }
        }
        const newInstitution = await this.InstitutionModel.findByIdAndUpdate(id, institution).setOptions({new: true, overwrite: true}).exec();
        return newInstitution;
    
    }

    async softDelete(id: Types.ObjectId) {
        const filter = {_id: id.toString()};
        const softDeletedInstitution = await this.InstitutionModel.softDelete(filter)
        return softDeletedInstitution;
    }

    async restore(id: Types.ObjectId) {
        const filter = {_id: id.toString()};
        const restoredInstitution = await this.InstitutionModel.restore(filter)
        return restoredInstitution;
    }

    async deactive(id: Types.ObjectId) {
        const institution = await this.InstitutionModel.findById(id).exec();
        institution["isActive"] = false;
        const newInstitution = await this.InstitutionModel.findByIdAndUpdate(id, institution).setOptions({new: true, overwrite: true}).exec();
        return newInstitution;
    }

    async delete(id: Types.ObjectId) {
        const filter = {_id: id};
        return this.InstitutionModel.deleteOne(filter);
    }

    async reactive(id: Types.ObjectId) {
        const institution = await this.InstitutionModel.findById(id).exec();
        institution["isActive"] = true;
        const newInstitution = await this.InstitutionModel.findByIdAndUpdate(id, institution).setOptions({new: true, overwrite: true}).exec();
        return newInstitution;
    }




}