import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class PaymentService {

    _logger: Logger;

    constructor(){
        this._logger = new Logger(PaymentService.name);
    }

    async createPayment(){
        try {
            
        }
        catch(error){

        }
    }
}