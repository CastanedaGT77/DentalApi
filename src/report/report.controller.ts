import { Controller, Get, HttpStatus, Param, Res, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import {Response} from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('report')
//@UseGuards(AuthGuard)
export class ReportController {
    
    constructor(
        private readonly _reportService: ReportService
    ){}

    @Get('template')
    async getTemplate(@Res() response: Response){
        const pdfDoc = await this._reportService.template();
        response.setHeader('Content-Type', "application/pdf");
        pdfDoc.pipe(response);
        pdfDoc.end();
    }

    @Get('fullPatient/:id')
    async getFullPatientReport(@Param('id') id: number, @Res() response: Response){
        if(isNaN(id))
            return {code: HttpStatus.BAD_REQUEST, msg: "Invalid parameter"};
    
        const pdfDoc = await this._reportService.fullPatientReport(id);

        response.setHeader('Content-Type', "application/pdf");
        pdfDoc.pipe(response);
        pdfDoc.end();
        return true;
    }

    // @Get()
    // async firstReport(@Res() response: Response){
    //     const pdfDoc = this._reportService.test();

    //     response.setHeader('Content-Type', "application/pdf");
    //     pdfDoc.pipe(response);
    //     pdfDoc.end();
    // }
}