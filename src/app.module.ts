import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InstitutionModule } from 'src/modules/institution/institution.modules';
import {AuthModule} from 'src/modules/auth/auth.modules';
import {CertModule} from 'src/modules/certs/cert.module';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/b4e_v2'),  
    InstitutionModule,
    AuthModule,
    CertModule
  ],
})
// mongodb://localhost:27017/b4e_v2
// mongodb+srv://b4e:b4e@cluster0.cw6j5.mongodb.net/b4e?retryWrites=true&w=majority
export class AppModule {}
