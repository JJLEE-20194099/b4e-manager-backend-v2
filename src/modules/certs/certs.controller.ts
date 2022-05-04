import { Controller, Post, Body, Get, Request, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CertsService } from './certs.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Types } from 'mongoose';
import fs from 'fs';
@Controller('certs')
export class CertController {
    constructor(
        private readonly CertsService: CertsService
    ) { }

    // @Post('/wrap')
    // @UseInterceptors(
    //     FilesInterceptor('files', 100, {
    //         storage: diskStorage({
    //             destination: './uploads/',
    //         }),
    //     }),
    // )
    // async warpCerts(@UploadedFiles() files, @Body('certs') certsDto: string, @Body('uploadId') uploadId: string, @Request() req) {
    //     if (!fs.existsSync(`./uploads/${uploadId}`)) {
    //         fs.mkdirSync(`./uploads/${uploadId}`);
    //     }

    //     const certs = JSON.parse(certsDto);
    //     const wrapCerts = await this.CertsService.wrap(certs, uploadId, req.user.issuerId, req.user.institutionId);
    //     const stringCertPdf = await this.CertsService.generateCertPdfs(certs, new Types.ObjectId(req.user.issuerId));
    //     const response = [];
    //     for (let i = 0; i < wrapCerts.length; i++) {
    //         fs.rename(`./uploads/${files[i].filename}`, `./uploads/${uploadId}/${files[i].filename}.pdf`, () => {
    //         })
    //         const fileReponse = {
    //             filename: files[i].filename,
    //         };
    //         response.push(fileReponse);
    //         await this.CertsService.wrapFile(wrapCerts[i], files[i].filename)
    //     }
    //     return [response, stringCertPdf];

    // }

    @Get('/test')
    async test() {
        const stringCertPdfs = await this.CertsService.test("https://www.facebook.com/profile.php?id=100019764924146");
        console.log(stringCertPdfs);
    }


}