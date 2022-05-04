import { MongooseModule } from '@nestjs/mongoose';
import { Module} from '@nestjs/common';
import { CertsService } from 'src/modules/certs/certs.service';
import { CertController } from 'src/modules/certs/certs.controller';
import { Mongoose } from 'mongoose';

import {Cert, CertSchema} from 'src/models/cert.schema';
import {CertPdf, CertPdfSchema} from 'src/models/cert.pdf.schema';
import {Batch, BatchSchema } from 'src/models/batch.schema';
import { Template, TemplateSchema } from 'src/models/template.schema';
import { Issuer, IssuerSchema } from 'src/models/issuer.schema';
import { Institution, InstitutionSchema } from 'src/models/institution.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Cert.name, schema: CertSchema}, 
            {name: CertPdf.name, schema: CertPdfSchema},
            {name: Batch.name, schema: BatchSchema},
            {name: Template.name, schema: TemplateSchema},
            {name: Issuer.name, schema: IssuerSchema},
            {name: Institution.name, schema: InstitutionSchema}
        ])
    ],
    controllers: [CertController],
    providers: [CertsService]
})
export class CertModule {}