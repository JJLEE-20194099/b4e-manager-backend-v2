import { Controller, Post, Body, HttpCode, HttpStatus, HttpException } from '@nestjs/common';
import { InstitutionDto } from 'src/modules/institution/dto/institution.dto';
import { Institution } from 'src/models/institution.schema';

import { AuthService } from 'src/modules/auth/services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/register')
    async register(@Body() institution: InstitutionDto): Promise<InstitutionDto>{
        return await this.authService.registerAccount(institution);
    }

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() institution: InstitutionDto): Promise<string> {
        return await this.authService.login(institution);
    }

    @Post('/institutions')
    async getInstitutions(@Body('token') token: string): Promise<Institution> {
        const institution = await this.authService.getJwtInstitution(token);

        if (!institution) {
            throw new HttpException('Token expire', HttpStatus.INTERNAL_SERVER_ERROR)
        } else {
            return institution
        }
    }
}