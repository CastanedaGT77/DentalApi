import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { Repository } from "typeorm";
import { AppointmentData } from "./models/data/AppointmentData";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateAppointmentDto } from "./models/requests/CreateAppointmentDto";
import { PatientData } from "src/patient/models/data/PatientData";
import { BranchData } from "src/branch/models/data/BranchData";
import { UserData } from "src/user/models/data/UserData";

@Injectable()
export class AppointmentService {
    private _logger: Logger;

    // Constructor
    constructor(
        @InjectRepository(AppointmentData)
        private _appointmentRepository: Repository<AppointmentData>,
        @InjectRepository(PatientData)
        private _patientRepository: Repository<PatientData>,
        @InjectRepository(BranchData)
        private _branchData: Repository<BranchData>,
        @InjectRepository(UserData)
        private _userRepository: Repository<UserData>
    ){
        this._logger = new Logger(AppointmentService.name);
    }

    // Get all appointments
    async getAll(){
        try {
            const appointments = await this._appointmentRepository.find();
            return {code: HttpStatus.OK, data: appointments};
        }
        catch(error){
            this._logger.error("GET_ALL:", JSON.stringify(error));
            return null;
        }
    }

    // Get all appointment details
    async getById(){
        try {

        }
        catch(error){

        }
    }

    // Get appointments by branch
    async getByBranch(branchId: number){
        try {
            const appointments = await this._appointmentRepository.findBy({
                branchId
            });
            return appointments;
        }
        catch(error){
            this._logger.error("GET_BY_BRANCH:", JSON.stringify(error));
            return null;
        }
    }

    // Get appointments by patient
    async getByPatient(patientId: number){
        try {
            const appointments = await this._appointmentRepository.findBy({
                patientId
            });
            return appointments;
        }
        catch(error){
            this._logger.error("GET_BY_PATIENT:", JSON.stringify(error));
            return null;
        }
    }

    // Get appointments by user
    async getByUser(assignedUser: number){
        try {
            const appointments = await this._appointmentRepository.findBy({
                assignedUser
            });
            return appointments;
        }
        catch(error){
            this._logger.error("GET_BY_USER:", JSON.stringify(error));
            return null;
        }
    }

    // Create appointment
    async createAppointment(request: CreateAppointmentDto){
        try {
            
            // Validate patient
            if(!await this._patientRepository.findOneBy({
                id: request.patientId
            }))
                return {code: HttpStatus.BAD_REQUEST, msg: "Patient was not found."};
            
            // Validate assigned user
            if(!await this._userRepository.findOneBy({
                id: request.assignedUser
            }))
                return {code: HttpStatus.BAD_REQUEST, msg: "User was not found."};

            // Validate branch
            if(!await this._branchData.findOneBy({
                id: request.branchId
            }))
                return {code: HttpStatus.BAD_REQUEST, msg: "Branch was not found."};

            // Validate hour, branch and assigned user
            if(!await this._appointmentRepository.findOneBy({
                assignedUser: request.assignedUser,
                branchId: request.branchId,
                startHour: request.startHour
            }))
                return {code: HttpStatus.BAD_REQUEST, msg: "There is already an appointment created."};

            // Create appointment
            const appointmentEntity = await this._appointmentRepository.create({...request, status: 0});
            await this._appointmentRepository.save(appointmentEntity);
            return {code: HttpStatus.CREATED, msg: "Appointment was created."};
        }
        catch(error){
            this._logger.error("CREATE_APPOINTMENT:", error);
            return null;
        }
    }

    // Edit appointment

    // Delete appointment
    async deleteAppointment(appointmentId: number){
        try {
            const appointment = await this._appointmentRepository.findOneBy({
                id: appointmentId
            });
            if(!appointment)
                return {code: HttpStatus.BAD_REQUEST, msg: "Appointment was not found."};

            appointment.status = 2;
            this._appointmentRepository.save(appointment);            
        }
        catch(error){
            this._logger.error("DELETE_APPOINTMENT:", error);
            return null;
        }
    }
}