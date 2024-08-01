import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { CreatePaymentDto } from "./models/request/CreatePaymentDto";

@Controller('payment')
export class PaymentController {

    constructor(
       private readonly _paymentService: PaymentService 
    ){}

    @Get('patient/:id')
    async getPatientPayments(@Param('id') id: number){
        return await this._paymentService.getPaymentsByPatient(id);
    }

    @Get('pending/:id')
    async getPendingPayments(@Param('id') id: number){
        return await this._paymentService.getPatientPendingPayments(id);
    }

    @Post()
    async createPayment(@Body() request: CreatePaymentDto){
        return await this._paymentService.createPayment(request);
    }
}