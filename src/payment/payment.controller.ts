import { Controller, Post } from "@nestjs/common";
import { PaymentService } from "./payment.service";

@Controller('payment')
export class PaymentController {

    constructor(
       private readonly _paymentService: PaymentService 
    ){}

    @Post()
    async createPayment(){
        return await this._paymentService.createPayment();
    }
}