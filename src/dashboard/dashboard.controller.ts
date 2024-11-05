import { Controller, Get } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";

@Controller('dashboard')
export class DashboardController {

    constructor(
        private readonly _dashboard: DashboardService
    ){}

    
    @Get('users')
    async getUsers(){
        return await this._dashboard.getUsers();
    }

    @Get('patients')
    async getPatients(){
        return await this._dashboard.getPatients();
    }

    @Get('branchs')
    async getBranchs(){
        return await this._dashboard.getBranchs();
    }

    @Get('appointments')
    async getAppointments(){
        return await this._dashboard.getAppointments();
    }
}