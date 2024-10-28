import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PatientData } from "src/patient/models/data/PatientData";
import { UserData } from '../user/models/data/UserData';
import { BranchData } from "src/branch/models/data/BranchData";
import { AppointmentData } from "src/appointment/models/data/AppointmentData";

@Module({
    imports: [TypeOrmModule.forFeature([UserData, PatientData, BranchData, AppointmentData])],
    controllers: [DashboardController],
    providers: [DashboardService]
})
export class DashboardModule {}