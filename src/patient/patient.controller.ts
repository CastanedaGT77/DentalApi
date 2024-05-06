import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './models/requests/CreatePatientDto';
import { DeletePatientDto } from './models/requests/DeletePatientDto';

@Controller('patient')
//@UseGuards(AuthGuard)
export class PatientController {

    constructor(
        private readonly _patientService: PatientService
    ){}

    // Get all patients
    @Get('all')
    async getPatients(){
        const patients = await this._patientService.getAllPatients();
        if(!patients)
            return {code: HttpStatus.INTERNAL_SERVER_ERROR, message: "Error. No se han podido obtener los usuarios."}
        return {patients, code: 200}
    }

    // Get approved patients
    @Get('approved')
    async getApproved(){
        const patients = await this._patientService.getApprovedPatients();
        if(!patients)
            return {code: HttpStatus.INTERNAL_SERVER_ERROR, message: "Error. No se han podido obtener los usuarios."}
        return {patients, code: 200}
    }

    // Get unapproved patients
    @Get('unapproved')
    async getUnApproved(){
        const patients = await this._patientService.getUnApprovedPatients();
        if(!patients)
            return {code: HttpStatus.INTERNAL_SERVER_ERROR, message: "Error. No se han podido obtener los usuarios."}
        return {patients, code: 200}
    }

    // Get disabled patients
    @Get('disabled')
    async getDisabled(){
        const patients = await this._patientService.getDisabledPatients();
        if(!patients)
            return {code: HttpStatus.INTERNAL_SERVER_ERROR, message: "Error. No se han podido obtener los usuarios."}
        return {patients, code: HttpStatus.OK}
    }

    // TODO: Get basic info patient
    @Get("info")
    async getBasicInfo(){
    }


    // Get all history


    // Create patient
    @Post()
    async create(@Body() request: CreatePatientDto){
        const response = await this._patientService.createPatient(request);
        if(response === null){
            return {code: HttpStatus.INTERNAL_SERVER_ERROR, message: "Error. No se ha podido crear el usuario."}
        }
        return {code: HttpStatus.CREATED, message: "Paciente creado correctamente."};
    }

    // Edit patient


    // TODO: Approve patient


    // Delete patient
    @Delete()
    async delete(@Body() request: DeletePatientDto){
        const response = await this._patientService.deletePatient(request);
        if(response === HttpStatus.BAD_REQUEST){
            return {code: HttpStatus.BAD_REQUEST, message: "Error. Paciente no existente."}
        }
        return  {code: HttpStatus.OK, message: "Paciente eliminado correctamente."}
    }
    
}