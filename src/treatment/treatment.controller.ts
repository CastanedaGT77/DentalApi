import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { CreateTreatmentDto } from "./models/requests/CreateTreatmentDto";
import { TreatmentService } from "./treatment.service";
import { AddTreatmentDetailDto } from "./models/requests/AddTreatmentDetailDto";
import { UpdateTreatmentDetailDto } from "./models/requests/UpdateTreatmentDetailDto";

@Controller('treatment')
export class TreatmentController {

    constructor(
        private readonly _treatmentService: TreatmentService
    ){}

    // Get all header treatments, all patients, all status
    @Get()
    async getTreatments(){
        return await this._treatmentService.getAll();
    }


    // Get by patient
    @Get('patient/:id')
    async getByPatient(@Param('id') id: number){
        return await this._treatmentService.getByPatient(id);
    }

    
    // 

    // Get all header treatment
    @Get('patient/header')
    async getTreatmentHeader(@Param('id') id: number){
        return await this._treatmentService.getPendingTreatmentHeaderByPatient(id);
    } 

    // Get pending header treatment by patient
    @Get('patient/header/:id')
    async getTreatmentHeaderByPatient(@Param('id') id: number){
        return await this._treatmentService.getPendingTreatmentHeaderByPatient(id);
    } 

    @Post()
    async createTreatment(@Body() request: CreateTreatmentDto){
        return await this._treatmentService.createTreatment(request);
    }

    @Post('detail')
    async addTreatmentDetail(@Body() request: AddTreatmentDetailDto){
        return await this._treatmentService.addTreatmentDetail(request);
    }

    @Put('detail')
    async updateTreatmentDetail(@Body() request: UpdateTreatmentDetailDto){
        return await this._treatmentService.updateTreatmentDetail(request);
    }

    @Delete('detail/:id')
    async deleteTreatmentDetail(@Param('id') id: number){
        return await this._treatmentService.deleteTreatmentDetail(id);
    }
}