import { Body, Controller, Get, HttpStatus, Param, Post, Res, UseGuards } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { CreatePaymentDto } from "./models/request/CreatePaymentDto";
import { AuthGuard } from "src/auth/auth.guard";
import { ReportService } from "src/report/report.service";
import {Response} from 'express';

@Controller('payment')
@UseGuards(AuthGuard)
export class PaymentController {

    constructor(
       private readonly _paymentService: PaymentService
    ){}

    @Get('all')
    async getPayments(){
        return await this._paymentService.getAllPayments();
    }

    @Get('patient/:id')
    async getPatientPayments(@Param('id') id: number){
        return await this._paymentService.getPaymentsByPatient(id);
    }

    @Get('pending/:id')
    async getPendingPayments(@Param('id') id: number){
        return await this._paymentService.getPatientPendingPayments(id);
    }

    @Post()
    async createPayment(@Body() request: CreatePaymentDto, @Res() response: Response){
        const payment = await this._paymentService.createPayment(request);

        if(!payment)
            return {code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "Payment could not be made"};

        const pdfDoc = await this._paymentService.getReceipt(payment);
        response.setHeader('Content-Type', "application/pdf");
        pdfDoc.pipe(response);
        pdfDoc.end();
    }

    @Get('receipt/:id')
    async getPaymentReceipt(@Param('id') id: number, @Res() response: Response){
        const pdfDoc = await this._paymentService.getReceipt(id);
        response.setHeader('Content-Type', "application/pdf");
        pdfDoc.pipe(response);
        pdfDoc.end();
    }
}