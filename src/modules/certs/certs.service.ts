import { Model, Types } from 'mongoose';
import { Injectable, Type } from '@nestjs/common';
import { CertDto } from './dto/cert.dto';
import { InjectModel } from '@nestjs/mongoose';

import { Cert, CertDocument, CertSchema } from 'src/models/cert.schema';
import { Issuer, IssuerDocument, IssuerSchema } from 'src/models/issuer.schema';
import { Institution, InstitutionDocument, InstitutionSchema } from 'src/models/institution.schema';
import { Batch, BatchDocument, BatchSchema } from 'src/models/batch.schema';
import { Template, TemplateDocument, TemplateSchema } from 'src/models/template.schema';
import { CertPdf, CertPdfDocument, CertPdfSchema } from 'src/models/cert.pdf.schema';
import { CertStatus } from 'src/public/enum';

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as fontkit from "@pdf-lib/fontkit";
import * as fs from 'fs';

import { promises as fs_promises } from 'fs';

import * as qr from 'qrcode';

@Injectable()
export class CertsService {

    constructor(
        @InjectModel(Cert.name) private CertModel: Model<CertDocument>,
        @InjectModel(Batch.name) private BatchModel: Model<BatchDocument>,
        @InjectModel(Issuer.name) private IssuerModel: Model<IssuerDocument>,
        @InjectModel(Institution.name) private InstitutionModel: Model<InstitutionDocument>,
        @InjectModel(Template.name) private TemplateModel: Model<TemplateDocument>,
        @InjectModel(CertPdf.name) private CertPdfModel: Model<CertPdfDocument>,
    ) { }

    async wrap(batchData: CertDto[], uploadId: "test", issuerId: Types.ObjectId): Promise<any> {
        const issuer = await this.IssuerModel.findById(issuerId).exec();
        const existBatch = await this.BatchModel.find({ uploadId: uploadId }).exec();
        let createdBatch;
        if (createdBatch.length === 0) {
            createdBatch = new this.BatchModel({
                issuerId: issuerId,
                status: CertStatus.Pending,
                count: batchData.length,
                uploadId: uploadId,
                issuer: {

                }
            });
            createdBatch.save();
        }
    }

    // async generateCertPdfs(certs: CertDto[], issuerId: string, institutionId: string): Promise<string[]>{
    //     const fake_certs = [{
    //         "studentId": "20194099",
    //         "name": "test test test test",
    //         "dob": "test",
    //         "indentityNumber": "324234324",
    //         "testDate": "26/9/2001",
    //         "validDate": "26/9/2001",
    //         "listening": 1000,
    //         "speaking": 1000,
    //         "reading": 1000,
    //         "writing": 1000,
    //         "totalScore": 1000,
    //         "email": "long.lt194099@sis.hust.edu.vn",
    //         "type": "toeic"
    //     }];

    //     const type = fake_certs[0]["type"];



    //     const template = await this.templateModel.findOne({institutionId: institutionId, type: type}).exec();
    //     const templatePdfString = template["templatePdfString"];

    // }   

    drawTextUtil(page, customFont, text, x_coordinate, y_coordinate, textSize, options): any {
        const textWidth = customFont.widthOfTextAtSize(text, textSize);
        const textHeight = customFont.heightAtSize(textSize);
        page.drawText(text, {
            x: x_coordinate,
            y: y_coordinate,
            size: textSize,
            font: customFont,
            ...options
        });
    }

    async handlingEachCert(pdfDoc, fontBytes, textSize, fake_certs, qrBytes, options): Promise<any> {
        let doc = pdfDoc;


        doc.registerFontkit(fontkit);
        let customFont;
        if (fontBytes) {
            customFont = await doc.embedFont(fontBytes);
        } else {
            customFont = await doc.embedFont(StandardFonts.TimesRoman);
        }

        let page = doc.getPages()[0];

        let height = customFont.heightAtSize(textSize);

        this.drawTextUtil(page, customFont, fake_certs[0]["name"], 300, 575, textSize, options)
        this.drawTextUtil(page, customFont, fake_certs[0]["dateOfBirth"], 300, 575 - height - 2, textSize, options)
        this.drawTextUtil(page, customFont, fake_certs[0]["reading"].toString(), 300, 575 - 2 * height - 6, textSize, options)
        this.drawTextUtil(page, customFont, fake_certs[0]["listening"].toString(), 300, 575 - 3 * height - 10, textSize, options)
        this.drawTextUtil(page, customFont, fake_certs[0]["totalScore"].toString(), 300, 575 - 4 * height - 14, textSize, options)
        this.drawTextUtil(page, customFont, fake_certs[0]["testDate"], 300, 575 - 5 * height - 18, textSize, options)
        this.drawTextUtil(page, customFont, fake_certs[0]["validDate"], 300, 575 - 6 * height - 22, textSize, options)
        let qrImage, dims;
        qrImage = await doc.embedPng(qrBytes);
        dims = qrImage.scale(0.5)

        page.drawImage(qrImage, {
            x: page.getWidth() / 2 - dims.width / 2,
            y: dims.height - 10,
            width: dims.width,
            height: dims.height,
        })

        let emptyPdfDoc = await PDFDocument.create();
        emptyPdfDoc.registerFontkit(fontkit);

        if (fontBytes) {
            customFont = await emptyPdfDoc.embedFont(fontBytes);
        } else {
            customFont = await emptyPdfDoc.embedFont(StandardFonts.TimesRoman);
        }

        let emptyPage = emptyPdfDoc.addPage();


        this.drawTextUtil(emptyPage, customFont, "Mr/Miss:", 120, 575, textSize, options)
        this.drawTextUtil(emptyPage, customFont, fake_certs[0]["name"], 300, 575, textSize, options)

        this.drawTextUtil(emptyPage, customFont, "Date of Birth:", 120, 575 - height - 2, textSize, options)
        this.drawTextUtil(emptyPage, customFont, fake_certs[0]["dateOfBirth"], 300, 575 - height - 2, textSize, options)

        this.drawTextUtil(emptyPage, customFont, "Reading:", 120, 575 - 2 * height - 6, textSize, options)
        this.drawTextUtil(emptyPage, customFont, fake_certs[0]["reading"].toString(), 300, 575 - 2 * height - 6, textSize, options)

        this.drawTextUtil(emptyPage, customFont, "Listening:", 120, 575 - 3 * height - 10, textSize, options)
        this.drawTextUtil(emptyPage, customFont, fake_certs[0]["listening"].toString(), 300, 575 - 3 * height - 10, textSize, options)

        this.drawTextUtil(emptyPage, customFont, "Full:", 120, 575 - 4 * height - 14, textSize, options)
        this.drawTextUtil(emptyPage, customFont, fake_certs[0]["totalScore"].toString(), 300, 575 - 4 * height - 14, textSize, options)

        this.drawTextUtil(emptyPage, customFont, "Test date:", 120, 575 - 5 * height - 18, textSize, options)
        this.drawTextUtil(emptyPage, customFont, fake_certs[0]["testDate"], 300, 575 - 5 * height - 18, textSize, options)

        this.drawTextUtil(emptyPage, customFont, "Valid date:", 120, 575 - 6 * height - 22, textSize, options)
        this.drawTextUtil(emptyPage, customFont, fake_certs[0]["validDate"], 300, 575 - 6 * height - 22, textSize, options)

        qrImage = await emptyPdfDoc.embedPng(qrBytes);
        dims = qrImage.scale(0.5)

        emptyPage.drawImage(qrImage, {
            x: emptyPage.getWidth() / 2 - dims.width / 2,
            y: dims.height - 10,
            width: dims.width,
            height: dims.height,
        })

        return Promise.all([doc.save(), emptyPdfDoc.save()])
    }

    



    async test(url: string): Promise<string[]> {


        const fake_certs = [{
            "studentId": "20194099",
            "name": "Nguyễn Thành Nam",
            "dob": "test",
            "dateOfBirth": "26/09/2001",
            "indentityNumber": "324234324",
            "testDate": "26/9/2001",
            "validDate": "26/9/2001",
            "listening": 1000,
            "speaking": 1000,
            "reading": 1000,
            "writing": 1000,
            "totalScore": 2000,
            "email": "long.lt194099@sis.hust.edu.vn",
            "type": "toeic"
        }];

        const pdfBytes = fs.readFileSync('src/public/pdf/template/toeic.hust.pdf');
        const pdfDoc = await PDFDocument.load(pdfBytes);

        const fontBytes = await new Promise((resolve: (data: null | Buffer) => void) =>
            fs.readFile('src/public/font/Crimson-Roman.otf', (err, data) => {
                if (err) resolve(null);
                else resolve(data);
            }),
        );

        const textSize = 22;
        const options = {
            color: rgb(0, 0, 0)
        }

        let qrBytes;
        qrBytes = await new Promise((resolve: (data: null | Buffer) => void) =>
            fs.readFile('src/public/image/qrcode-default.png', (err, data) => {
                if (err) resolve(null);
                else resolve(data);
            }),
        );

        let qrImage;
        let dims;
        let certPromises = []
        for (let i = 0; i < 1; i++) {
            certPromises.push(() => this.handlingEachCert(pdfDoc, fontBytes, textSize, fake_certs, qrBytes, options))
        }

        const modifiedPdfArr = await Promise.all(certPromises.map(promise => promise()))
        let saveToDbPromises = []
        for (let certPdfSet of modifiedPdfArr) {
            let modifiedPdfBytes = certPdfSet[0]
            let modifiedEmptyPdfBytes = certPdfSet[1]

            let temp = {
                "studentId": "test",
                "institutionId": "test",
                "pdfString": modifiedPdfBytes,
                "noBackgroundPdfString": modifiedEmptyPdfBytes,
                "type": "test"
            }
            let createdCertPdf = new this.CertPdfModel(temp);
            saveToDbPromises.push(() => createdCertPdf.save())
        }

        let saveToFileSystemPromises = []
        for (let i = 0; i < modifiedPdfArr.length; i++) {
            let certPdfSet = modifiedPdfArr[i]
            let modifiedPdfBytes = certPdfSet[0]
            let modifiedEmptyPdfBytes = certPdfSet[1]
        
            saveToFileSystemPromises.push(() => 
                Promise.all(
                    [
                        
                        fs_promises.writeFile(`src/public/pdf/${i}_toeic.hust.pdf`, modifiedPdfBytes),
                        fs_promises.writeFile(`src/public/pdf/${i}_empty_toeic.hust.pdf`, modifiedEmptyPdfBytes)
                    ]
                )
            )
        }
        
        const t1 = performance.now()
        const _ = await Promise.all([
            Promise.all(saveToDbPromises.map(promise => promise())),
            Promise.all(saveToFileSystemPromises.map(promise => promise()))
        ])
        const t2 = performance.now()
        console.log((t2 - t1) / (1000 * 60))

        return ["res"];
    }

}