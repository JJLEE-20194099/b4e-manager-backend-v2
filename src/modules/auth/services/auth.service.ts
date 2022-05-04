import { Injectable, HttpException, HttpStatus} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Institution, InstitutionDocument, InstitutionSchema } from 'src/models/institution.schema';
import { InstitutionDto } from 'src/modules/institution/dto/institution.dto';
import { InstitutionFilterDto } from 'src/modules/institution/dto/institutionFilter.dto';
import { InstitutionUpdateDto } from 'src/modules/institution/dto/institutionUpdate.dto';
import * as bcrypt from 'bcrypt';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { JwtService } from '@nestjs/jwt';
import { InstitutionService } from 'src/modules/institution/services/institution.service';

@Injectable()
export class AuthService {
    constructor(
        private institutionService: InstitutionService,
        private jwtService: JwtService
    ){}

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 12);
    }

    async doesInstitutionExist(email: string): Promise<boolean> {
        const institution = await this.institutionService.findByEmail(email);
        return !!institution
    }

    async registerAccount(institutionDto: InstitutionDto): Promise<InstitutionDto> {
        const email = institutionDto.email;
        const isExist = this.doesInstitutionExist(email);
        
        if (isExist) {
            throw new HttpException(
                'An institution manager has already been created with this email address',
                HttpStatus.BAD_REQUEST,

            );
        } else {
            const hashPassword = await this.hashPassword(institutionDto.password);
            await this.institutionService.create({
                ...institutionDto,
                password: hashPassword
            });
            return institutionDto
        }
    }

    async validateInstitution(email: string, password: string): Promise<any> {
        const institution = await this.institutionService.findByFilter({
            email: email,
        });

        if (!institution) {
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: "Invalid Credentials"
            },
                HttpStatus.FORBIDDEN
            );
        } else {
            const isValidPassword = await bcrypt.compare(password, institution[0].password);
            if (isValidPassword) {
                return {
                    email: institution[0].email,
                    id: institution[0]._id.toString(),
                    isActive: institution[0].isActive
                }
            } else {
                throw new HttpException(
                    {status: HttpStatus.FORBIDDEN, error: "Wrong Password"},
                    HttpStatus.FORBIDDEN
                );
            }
        }
    }

    async login(institutionDto: InstitutionDto): Promise<any> {
        const validateInstitution = await this.validateInstitution(institutionDto.email, institutionDto.password);

        if (validateInstitution) {
            const payload = {
                email: validateInstitution.email,
                isActive: validateInstitution.isActive,
                institutionId: validateInstitution.id
            };
            const accessToken = await this.jwtService.signAsync(payload);
            return {
                access: true,
                message: "Logged Successfully",
                email: institutionDto.email,
                accessToken: accessToken,
                isActive: institutionDto.isActive
            }
        }
    }

    async getJwtInstitution(jwt: string): Promise<Institution | null> {
        try {
            this.jwtService.verify(jwt);
        } catch {
            return null;
        }

        const data = this.jwtService.decode(jwt);
        const institution = await this.institutionService.findByEmail(data['email'])

        return institution;
    }




}