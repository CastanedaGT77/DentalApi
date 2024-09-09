import { Controller, Get, Res } from '@nestjs/common';
import { ReportService } from './report.service';
import {Response} from 'express';

@Controller('report')
export class ReportController {
    
    constructor(
        private readonly _reportService: ReportService
    ){}

    @Get()
    async firstReport(@Res() response: Response){
        const pdfDoc = this._reportService.test();

        response.setHeader('Content-Type', "application/pdf");

        pdfDoc.pipe(response);
        pdfDoc.end();
    }
}