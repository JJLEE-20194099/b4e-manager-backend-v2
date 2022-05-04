import { MongooseModule } from '@nestjs/mongoose';
import { Template, TemplateSchema } from 'src/models/template.schema';
import { TemplateController } from 'src/modules/template/controllers/template.controller';
import { TemplateService } from 'src/modules/template/services/template.service';
import { Module, forwardRef } from '@nestjs/common';


@Module({
    imports: [
        MongooseModule.forFeature([{name:Template.name, schema: TemplateSchema}])
    ],
    controllers: [TemplateController],
    providers: [TemplateService]
})

export class TemplateModule {
    
}