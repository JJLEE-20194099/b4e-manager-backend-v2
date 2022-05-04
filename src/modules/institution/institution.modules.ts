import { MongooseModule } from '@nestjs/mongoose';
import { Institution, InstitutionSchema } from 'src/models/institution.schema';
import { InstitutionController } from 'src/modules/institution/controllers/institution.controller';
import { InstitutionService } from 'src/modules/institution/services/institution.service';
import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/public/constants';


import { AuthModule } from 'src/modules/auth/auth.modules';
@Module({
    imports: [
        MongooseModule.forFeature([{ name: Institution.name, schema: InstitutionSchema }]), forwardRef(() => AuthModule)

    ],
    controllers: [InstitutionController],
    providers: [InstitutionService]
})

export class InstitutionModule {

}