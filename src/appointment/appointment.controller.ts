import { Body, Controller, Get, Post, HttpStatus } from '@nestjs/common';
import { AppointmentService } from "./appointment.service";
import { CreateAppointmentDto } from "./models/requests/CreateAppointmentDto";

@Controller('appointment')
export class AppointmentController {

    constructor(
        private readonly _appointmentService: AppointmentService
    ){}

    @Get('all')
    async getAll(){
        const response = await this._appointmentService.getAll();
    }

    @Post()
    async create(@Body() request: CreateAppointmentDto){
        const response = await this._appointmentService.createAppointment(request);
        if(response){
            return {code: HttpStatus.CREATED, msg: "Appointment created correctly."}
        }
        return {code: HttpStatus.BAD_REQUEST, msg: "Error. The appointment was not created"};
    }
    
}