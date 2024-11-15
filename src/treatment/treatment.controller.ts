import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, UseGuards } from "@nestjs/common";
import { CreateTreatmentDto } from "./models/requests/CreateTreatmentDto";
import { TreatmentService } from "./treatment.service";
import { AddTreatmentDetailDto } from "./models/requests/AddTreatmentDetailDto";
import { UpdateTreatmentDetailDto } from "./models/requests/UpdateTreatmentDetailDto";
import { AuthGuard } from "src/auth/auth.guard";
import { UpdateTreatmentDto } from "./models/requests/UpdateTreatmentDto";

@Controller('treatment')
@UseGuards(AuthGuard)
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

    @Get('patient/pending/:id')
    async getPendingByPatient(@Param('id') id: number){
        return await this._treatmentService.getPendingByPatient(id);
    }

    // Get all treatment details
    @Get(':id')
    async getTreatmentSummary(@Param('id') id: number){
        return await this._treatmentService.getTreatmentSummary(id);
    } 

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

    @Put()
    async updateTreatment(@Body() request: UpdateTreatmentDto){
        return await this._treatmentService.updateTreatment(request);
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