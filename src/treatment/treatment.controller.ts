import { Body, Controller, HttpStatus, Post } from "@nestjs/common";
import { CreateTreatmentDto } from "./models/requests/CreateTreatmentDto";
import { TreatmentService } from "./treatment.service";

@Controller('treatment')
export class TreatmentController {

    constructor(
        private readonly _treatmentService: TreatmentService
    ){}

    @Post()
    async createTreatment(@Body() request: CreateTreatmentDto){
        const response = await this._treatmentService.createTreatment(request);
        if(response === HttpStatus.BAD_REQUEST){
            return {code: HttpStatus.BAD_REQUEST, message: "Error. La información proporcionada es incorrecta."};
        }
        return true;
    }
}