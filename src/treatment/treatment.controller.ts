import { Body, Controller, Get, HttpStatus, Param, Post } from "@nestjs/common";
import { CreateTreatmentDto } from "./models/requests/CreateTreatmentDto";
import { TreatmentService } from "./treatment.service";

@Controller('treatment')
export class TreatmentController {

    constructor(
        private readonly _treatmentService: TreatmentService
    ){}

    // Get by patient
    @Get('patient/:id')
    async getByPatient(@Param('id') id: number){
        return await this._treatmentService.getByPatient(id);
    }

    @Post()
    async createTreatment(@Body() request: CreateTreatmentDto){
        return await this._treatmentService.createTreatment(request);
    }
}