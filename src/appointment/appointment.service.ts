import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { AppointmentData } from "./models/data/AppointmentData";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateAppointmentDto } from "./models/requests/CreateAppointmentDto";

@Injectable()
export class AppointmentService {

    // Constructor
    constructor(
        @InjectRepository(AppointmentData)
        private _appointmentRepository: Repository<AppointmentData>
    ){
    }

    // Get all appointments
    async getAll(){
        try {
            const appointments = await this._appointmentRepository.find();
            return appointments;
        }
        catch(error){
            console.log("ERROR:APPOINTMENT.SERVICE.GET-ALL: ",error);
            return null;
        }
    }

    // Get all appointments
    async getByBranch(){
        try {
            const appointments = await this._appointmentRepository.find();
            return appointments;
        }
        catch(error){
            console.log("ERROR:APPOINTMENT.SERVICE.GET-ALL: ",error);
            return null;
        }
    }

    // Get all appointments
    async getById(){
        try {
            const appointments = await this._appointmentRepository.find();
            return appointments;
        }
        catch(error){
            console.log("ERROR:APPOINTMENT.SERVICE.GET-ALL: ",error);
            return null;
        }
    }

    // Create appointment
    async createAppointment(request: CreateAppointmentDto){
        try {
            const entity = this._appointmentRepository.create(request);
        }
        catch(error){
            console.log("ERROR:APPOINTMENT.SERVICE.CREATE: ",error);
            return null;
        }
    }

    // Edit appointment

    // Delete appointment

    // Get appointments by patient
}