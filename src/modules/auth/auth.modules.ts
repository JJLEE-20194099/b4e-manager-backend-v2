import { MongooseModule } from '@nestjs/mongoose';
import { Institution, InstitutionSchema } from 'src/models/institution.schema';
import { InstitutionController } from 'src/modules/institution/controllers/institution.controller';
import { InstitutionService } from 'src/modules/institution/services/institution.service';
import { Module, forwardRef } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guards';
import { JwtStrategy } from 'src/modules/auth/guards/jwt.strategy';
import { LocalStrategy } from 'src/modules/auth/guards/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/public/constants';
import { AuthController } from './controllers/auth.controllers';
import { AuthService } from './services/auth.service';
import { InstitutionModule } from 'src/modules/institution/institution.modules';

@Module({
    imports: [
        forwardRef(() => InstitutionModule),
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '90d' },
        }),
        MongooseModule.forFeature([{ name: Institution.name, schema: InstitutionSchema }]),

    ],
    controllers: [InstitutionController, AuthController],
    providers: [AuthService, InstitutionService, JwtStrategy, LocalStrategy, JwtAuthGuard],
    exports: [InstitutionService, AuthService]
})

export class AuthModule {}