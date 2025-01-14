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
import { TreatmentDetailsData } from "src/treatment/models/data/TreatmentDetailsData";

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
        private _userRepository: Repository<UserData>,
        @InjectRepository(TreatmentDetailsData)
        private _treatmentDetailRepo: Repository<TreatmentDetailsData>
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
            let formattedAppointments: any[] = [];
            const appointments = await this._appointmentRepository.find({
                select: {
                    patientId: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true
                    },
                    branchId: {
                        id: true,
                        name: true
                    }
                },
                relations: {
                    patientId: true,
                    branchId: true
                }
            });

            const users = await this._userRepository.find({
                select: {
                    id: true,
                    firstName: true,
                    lastName: true
                }
            });

            formattedAppointments = appointments;
            for(const appointment of formattedAppointments){
                const user = users.find(u => u.id === appointment.assignedUser);
                if(user){
                    appointment.assignedUser = user;
                }
            }

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
            const branch = await this._appointmentRepository.findOneByOrFail({
                id: branchId
            });
            const appointments = await this._appointmentRepository.findBy({
                branchId: branch
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
            const [day, month, year] = request.appointmentDate.toString().split('/');
            const appDate = new Date(Number(year), Number(month) - 1, Number(day));

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
            const branch = await this._branchData.findOneBy({id: request.branchId});
            if(!branch)
                return {code: HttpStatus.BAD_REQUEST, msg: "Branch was not found."};

            // Validate hour, branch and assigned user
            const appointments = await this._appointmentRepository.findBy({
                assignedUser: request.assignedUser,
                branchId: {
                    id: request.branchId
                },
                status: 0
            });
            const apps = appointments.filter(a => a.appointmentDate.getTime() == appDate.getTime());
            let invalidHour = false;
            apps.forEach(a => {
                let temp = this.isTimeInRange(a.startHour, a.endHour, request.startHour, request.endHour);
                if(temp)
                    invalidHour = true;
            });

            if(invalidHour)
                return {code: HttpStatus.BAD_REQUEST, msg: "There is already an appointment assigned."};

            if(this.timeStringToNumber(request.startHour) >= this.timeStringToNumber(request.endHour))
                return {code: HttpStatus.BAD_REQUEST, msg: "Invalid parameters: Hours"}

            // Create appointment
            const appointmentEntity = await this._appointmentRepository.create(
                {
                    ...request,
                    status: 0,
                    patientId: patient,
                    branchId: branch,
                    startedAt: new Date(),
                    endedAt: new Date(),
                    symptoms: "",
                    decription: "",
                    appointmentDate: appDate
                });
            await this._appointmentRepository.save(appointmentEntity);
            return {code: HttpStatus.CREATED, msg: "Appointment was created."};
        }
        catch(error){
            this._logger.error("CREATE_APPOINTMENT:", error);
            return { code: HttpStatus.INTERNAL_SERVER_ERROR, msg: error };
        }
    }

    // Start appointment
    async startAppointment(id: number){
        if(!id) return {code: HttpStatus.BAD_REQUEST, msg: "Invalid parameters: Id"};

        try {
            const appointment = await this._appointmentRepository.findOneByOrFail({
                id
            });
            const currentDate = new Date();
            const subtractedDate = new Date(currentDate.getTime() - 6 * 60 * 60 * 1000);
            appointment.startedAt = subtractedDate;
            await this._appointmentRepository.save(appointment);
            return {code: HttpStatus.OK, msg: "Appointment has been started."};
        }
        catch(error){
            this._logger.error(`Appointment: ${id} could not be started: ${error}`);
            return {code: HttpStatus.INTERNAL_SERVER_ERROR, msg: "Appointment could not be started"};
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
            const branch = await this._branchData.findOneBy({id: request.branchId});
            if(!branch)
                return {code: HttpStatus.BAD_REQUEST, msg: "Branch was not found."};

            // Validate hour, branch and assigned user
            const appointments = await this._appointmentRepository.findBy({
                id: Not(Equal(request.appointmentId)),
                assignedUser: request.assignedUser,
                branchId: branch,
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
            appointment.branchId = branch;
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

            for(const element of request.treatmentDetails){
                const detail = await this._treatmentDetailRepo.findOneBy({
                    id: Number(element)
                });
                if(detail){
                    detail.status = true;
                    await this._treatmentDetailRepo.save(detail);
                }
            }

            await this._appointmentRepository.save(appointment);

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