import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentData } from 'src/appointment/models/data/AppointmentData';
import { BranchData } from 'src/branch/models/data/BranchData';
import { PatientData } from 'src/patient/models/data/PatientData';
import { UserData } from 'src/user/models/data/UserData';
import { Between, Repository } from 'typeorm';

@Injectable()
export class DashboardService {

    private _logger: Logger;

    constructor(
        @InjectRepository(UserData)
        private readonly _userRepo: Repository<UserData>,
        @InjectRepository(PatientData)
        private readonly _patientRepo: Repository<PatientData>,
        @InjectRepository(BranchData)
        private readonly _branchRepo: Repository<BranchData>,
        @InjectRepository(AppointmentData)
        private readonly _appointmentRepo: Repository<AppointmentData>
    ){
        this._logger = new Logger(DashboardService.name);
    }

    async getUsers(){
        try {
            const users = await this._userRepo.find();
            const active = users.filter(u => u.isActive).length;
            const inactive = users.filter(u => !u.isActive).length;

            return {active, inactive};
        }
        catch(error){
            this._logger.error(`Error getting get users dashboard data: ${error}`);
            return {active: 0, inactive: 0};
        }
    }

    async getPatients(){
        try {
            const patients = await this._patientRepo.find();
            const active = patients.filter(u => u.active).length;
            const inactive = patients.filter(u => !u.active).length;

            return {active, inactive};
        }
        catch(error){
            this._logger.error(`Error getting patients dashboard data: ${error}`);
            return {active: 0, inactive: 0};
        }
    }

    async getBranchs(){
        try {
            const branchs = await this._branchRepo.find();
            const active = branchs.filter(u => u.active).length;
            const inactive = branchs.filter(u => !u.active).length;

            return {active, inactive};
        }
        catch(error){
            this._logger.error(`Error getting patients dashboard data: ${error}`);
            return {active: 0, inactive: 0};
        }
    }

    async getAppointments(){
        try {
            // Branchs
            const branchs = await this._branchRepo.find({
                select: {
                    id: true,
                    name: true
                }
            });
            // Response
            const response = [];

            for(let i = 0; i < branchs.length; i++){
                let branchData = {};
                // Today appointments
                const startDate = new Date().toString();
                const endDate = new Date().toString();
                const today = await this._appointmentRepo.count({
                    where: {
                        branchId: {
                            id: branchs[i].id
                        },
                        appointmentDate: Between(startDate, endDate)
                    }
                });
                branchData = {
                    ...branchs[i],
                    today,
                }

                response.push(branchData);
            }

            return response;

        }
        catch(error){

        }
    }
}