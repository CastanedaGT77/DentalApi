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
                },
                where: {
                    active: true
                }
            });
            // Response
            const response = [];

            for(let i = 0; i < branchs.length; i++){
                let branchData = {};

                // Appointments
                const appointments = await this._appointmentRepo.find({
                    where: {
                        branchId: {
                            id: branchs[i].id
                        },
                        status: 0
                    }
                })

                // Today appointments


                const startDate = new Date(new Date().setHours(0,0,0,0)).getTime();
                const endDate = new Date(new Date().setHours(24,0,0,0)).getTime();
                const today = appointments.filter(a => {
                    const ap = a.appointmentDate.getTime();
                    if(startDate <= ap && ap <= endDate)
                        return a;
                });
                
                // Tomorrow appointments
                const startOfPreviousDay = new Date();
                startOfPreviousDay.setDate(startOfPreviousDay.getDate() + 1);
                startOfPreviousDay.setHours(0, 0, 0, 0);
                const endOfPreviousDay = new Date();
                endOfPreviousDay.setDate(endOfPreviousDay.getDate() + 1);
                endOfPreviousDay.setHours(24, 0, 0, 0);
             
                const tomorrow = appointments.filter(a => {
                    const ap = a.appointmentDate.getTime();
                    if(startOfPreviousDay.getTime() <= ap && ap <= endOfPreviousDay.getTime())
                        return a;
                });
                
                // Week appointments
                var current = new Date; // get current date
                var firstWeek = new Date(current);
                firstWeek.setDate(current.getDate() - current.getDay());
                firstWeek.setHours(24,0,0,0);
                
                var lastWeek = new Date(firstWeek);
                lastWeek.setDate(firstWeek.getDate() + 6);
                lastWeek.setHours(24, 0, 0, 0);
                const week = appointments.filter(a => {
                    const ap = a.appointmentDate.getTime();
                    if(firstWeek.getTime() <= ap && ap <= lastWeek.getTime())
                        return a;
                });
                
                branchData = {
                    ...branchs[i],
                    today: today.length,
                    tomorrow: tomorrow.length,
                    week: week.length
                }

                response.push(branchData);
            }

            return response;

        }
        catch(error){

        }
    }
}