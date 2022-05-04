import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InstitutionService} from 'src/modules/institution/services/institution.service';
import { AuthService } from '../../auth/services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private institutionService: InstitutionService) {
        super();
    }
    async validate(email: string, password: string): Promise<any> {
        const institution = await this.authService.validateInstitution(email, password);

        if (!institution) {
            throw new UnauthorizedException();
        } 
        return institution;
    }
}