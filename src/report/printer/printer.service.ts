import { Injectable } from "@nestjs/common";
import PdfPrinter from "pdfmake";
import { BufferOptions, TDocumentDefinitions } from "pdfmake/interfaces";

const fonts = {
    Roboto: {
        normal: 'fonts/Roboto-Black.ttf'
    }
};

@Injectable()
export class PrinterService {
    private printer: PdfPrinter;

    constructor(){
        this.printer = new PdfPrinter(fonts);
    }

    createPdf(
        docDefinition: TDocumentDefinitions,
        options: BufferOptions = {}
    ) : PDFKit.PDFDocument {
        return this.printer.createPdfKitDocument(docDefinition, options);
    }
}