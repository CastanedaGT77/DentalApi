import { Injectable, Logger } from '@nestjs/common';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { PrinterService } from './printer/printer.service';
import { firstReport } from './data/firstReport';

@Injectable()
export class ReportService {

    constructor(
        private readonly _printerService: PrinterService
    ){}

    test(){
        const document = firstReport("Titulo");

        return this._printerService.createPdf(document);
    }
}