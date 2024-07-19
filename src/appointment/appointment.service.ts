import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { Equal, Not, Repository } from "typeorm";
import { AppointmentData } from "./models/data/AppointmentData";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateAppointmentDto } from "./models/requests/CreateAppointmentDto";
import { PatientData } from "src/patient/models/data/PatientData";
import { BranchData } from "src/branch/models/data/BranchData";
import { UserData } from "src/user/models/data/UserData";
import { UpdateAppointmentDto } from "./models/requests/UpdateAppointmentDto";
import { FinishAppointmentDto } from "./models/requests/FinishAppointmentDto";

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

    private timeStringToNumber(time: string){
        const [hours, minutes] = time.split(':').map(Number);
        return hours + minutes / 60;
    }

    private isTimeInRange(startHourValid: string, endHourValid: string, startTime: string, endTime: string): boolean {
        // Guardada
        const timeNumber = this.timeStringToNumber(startHourValid);
        const timeNumberEnd = this.timeStringToNumber(endHourValid);
        // Nueva
        const startTimeNumber = this.timeStringToNumber(startTime);
        const endTimeNumber = this.timeStringToNumber(endTime);
        // Validation
        const isStartTimeInRange = startTimeNumber >= timeNumber && startTimeNumber < timeNumberEnd;
        const isEndTimeInRange = endTimeNumber >= timeNumber && endTimeNumber <= timeNumberEnd;

        return isStartTimeInRange || isEndTimeInRange;
      }

    // Get all appointments
    async getAll(){
        try {
            const appointments = await this._appointmentRepository.find({
                select: {
                    patientId: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true
                    }
                },
                relations: {
                    patientId: true
                }
            });
            return {code: HttpStatus.OK, data: appointments};
        }
        catch(error){
            this._logger.error("GET_ALL:", JSON.stringify(error));
            return null;
        }
    }

    // Get appointment id
    async getById(id: number){
        try {
            const appointment = await this._appointmentRepository.findOneBy({
                id
            });

            if(!appointment)
                return { code: HttpStatus.BAD_REQUEST, msg: "Invalid parameters" };

            return { code: HttpStatus.OK, data: appointment };
        }
        catch(error){
            this._logger.error("GET_BY_ID:", JSON.stringify(error));
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: JSON.stringify(error) };
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
                patientId: {
                    id: patientId
                }
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
            const patient = await this._patientRepository.findOneBy({id: request.patientId});
            if(!patient)
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
            const appointments = await this._appointmentRepository.findBy({
                assignedUser: request.assignedUser,
                branchId: request.branchId,
                status: 0,
                appointmentDate: request.appointmentDate
            });
            let invalidHour = false;
            appointments.forEach(a => {
                let temp = this.isTimeInRange(a.startHour, a.endHour, request.startHour, request.endHour);
                if(temp)
                    invalidHour = true;
            });

            if(invalidHour)
                return {code: HttpStatus.BAD_REQUEST, msg: "There is already an appointment assigned."};

            if(this.timeStringToNumber(request.startHour) >= this.timeStringToNumber(request.endHour))
                return {code: HttpStatus.BAD_REQUEST, msg: "Invalid parameters: Hours"}

            // Create appointment
            const appointmentEntity = await this._appointmentRepository.create({...request, status: 0, patientId: patient});
            await this._appointmentRepository.save(appointmentEntity);
            return {code: HttpStatus.CREATED, msg: "Appointment was created."};
        }
        catch(error){
            this._logger.error("CREATE_APPOINTMENT:", error);
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: error };
        }
    }

    // Update appointment
    async updateAppointment(request: UpdateAppointmentDto){
        try {
            
            // Validate patient
            const patient = await this._patientRepository.findOneBy({id: request.patientId})
            if(!patient)
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
            const appointments = await this._appointmentRepository.findBy({
                id: Not(Equal(request.appointmentId)),
                assignedUser: request.assignedUser,
                branchId: request.branchId,
                status: 0,
                appointmentDate: request.appointmentDate
            });
            let invalidHour = false;
            appointments.forEach(a => {
                let temp = this.isTimeInRange(a.startHour, a.endHour, request.startHour, request.endHour);
                if(temp)
                    invalidHour = true;
            });

            if(invalidHour)
                return {code: HttpStatus.BAD_REQUEST, msg: "There is already an appointment assigned."};

            if(this.timeStringToNumber(request.startHour) >= this.timeStringToNumber(request.endHour))
                return {code: HttpStatus.BAD_REQUEST, msg: "Invalid parameters: Hours"}

            // Get appointment
            const appointment = await this._appointmentRepository.findOneBy({
                id: request.appointmentId
            });

            if(!appointment)
                return { code: HttpStatus.BAD_REQUEST, msg: "Invalid parameters" };

            // Populate data
            appointment.patientId = patient;
            appointment.branchId = request.branchId;
            appointment.assignedUser = request.assignedUser;
            appointment.appointmentDate = request.appointmentDate;
            appointment.startHour = request.startHour;
            appointment.endHour = request.endHour;

            await this._appointmentRepository.save(appointment);
            return {code: HttpStatus.CREATED, msg: "Appointment was updated."};
        }
        catch(error){
            this._logger.error("CREATE_APPOINTMENT:", error);
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: error };
        }
    }

    // Finish appointment
    async finishAppointment(request: FinishAppointmentDto){
        try {
            const appointment = await this._appointmentRepository.findOneBy({
                id: request.appointmentId
            });

            if(!appointment)
                return { code: HttpStatus.BAD_REQUEST, msg: "Invalid parameters" };
            
            appointment.status = 1;
            appointment.observations = request.observations;
            return { code: HttpStatus.OK, msg: "Appointment finished" };
        }
        catch(error){
            this._logger.error("FINISH:", JSON.stringify(error));
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: JSON.stringify(error) };
        }
    }

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