import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { CreatePaymentDto } from "./models/request/CreatePaymentDto";
import { AuthGuard } from "src/auth/auth.guard";

@Controller('payment')
//@UseGuards(AuthGuard)
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