import { Body, Controller, Get, Post, HttpStatus, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { AppointmentService } from "./appointment.service";
import { CreateAppointmentDto } from "./models/requests/CreateAppointmentDto";
import { UpdateAppointmentDto } from './models/requests/UpdateAppointmentDto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('appointment')
@UseGuards(AuthGuard)
export class AppointmentController {

    constructor(
        private readonly _appointmentService: AppointmentService
    ){}

    // Get all appointments
    @Get('all')
    async getAll(){
        return await this._appointmentService.getAll();
    }

    // Get appointments by branch
    @Get('branch/:id')
    async getByBranch(@Param('id', ParseIntPipe) id: number){
        const appointments = await this._appointmentService.getByBranch(id);
        return appointments;
    }

    // Get appointments by patient
    @Get('patient/:id')
    async getByPatient(@Param('id', ParseIntPipe) id: number){
        const appointments = await this._appointmentService.getByPatient(id);
        return appointments;
    }

    // Get appointments by user
    @Get('user/:id')
    async getByUser(@Param('id', ParseIntPipe) id: number){
        const appointments = await this._appointmentService.getByPatient(id);
        return appointments;
    }

    @Post()
    async create(@Body() request: CreateAppointmentDto){
        return await this._appointmentService.createAppointment(request);
    }

    @Put()
    async update(@Body() request: UpdateAppointmentDto){
        return await this._appointmentService.updateAppointment(request);
    }

}