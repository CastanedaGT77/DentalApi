import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './models/requests/CreatePatientDto';
import { DeletePatientDto } from './models/requests/DeletePatientDto';
import { SetProfileImageDto } from './models/requests/SetProfileImageDto';
import { UpdatePatientDto } from './models/requests/UpdatePatientDto';
import { RequirePermissions } from 'src/auth/permissions.decorator';

@Controller('patient')
//@UseGuards(AuthGuard)
export class PatientController {

    constructor(
        private readonly _patientService: PatientService
    ){}

    // Get ALL patients
    @RequirePermissions("PACIENTES:LISTAR")
    @Get()
    async getAll(@Req() request: any){
        console.log("request br:", request?.br);
        return await this._patientService.getAllPatients();
    }
 
    // Get active patients
    @Get('active')
    async getActive(){
        return await this._patientService.getActivePatients();
    }

    @Get('inactive')
    async getInactive(){
        return await this._patientService.getInactivePatients();
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

    // Get profile image
    @Get('profileImage/:id')
    async getProfileImage(@Param('id') id){
        return await this._patientService.getProfileImage(id);
    }

    // Set profile image
    @Post('profileImage')
    async setProfileImage(@Body() request: SetProfileImageDto){
        return await this._patientService.setProfileImage(request);
    }

    // Create patient
    @Post()
    async create(@Body() request: CreatePatientDto){
        return await this._patientService.createPatient(request);
    }

    // Edit patient
    @Put()
    async update(@Body() request: UpdatePatientDto){
        return await this._patientService.updatePatient(request);
    }


    // TODO: Approve patient


    // Delete patient
    @Delete()
    async delete(@Body() request: DeletePatientDto){
        return await this._patientService.deletePatient(request);
    }
}