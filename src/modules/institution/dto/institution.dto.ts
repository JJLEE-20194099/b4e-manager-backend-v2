import { InstitutionSchema } from 'src/models/institution.schema';

export class InstitutionDto {
    name: string;
    email: string;
    password: string;
    legalReference: string;
    intentDeclaration: string;
    host: string;
    documentStoreAddress?: string;
    isActive?: boolean;
    expirationDate?: string;
}


