import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppointmentData } from "./models/data/AppointmentData";
import { AppointmentController } from "./appointment.controller";
import { AppointmentService } from "./appointment.service";
import { PatientData } from "src/patient/models/data/PatientData";
import { BranchData } from "src/branch/models/data/BranchData";
import { UserData } from "src/user/models/data/UserData";
import { TreatmentDetailsData } from "src/treatment/models/data/TreatmentDetailsData";

@Module({
    imports: [
        TypeOrmModule.forFeature([AppointmentData, PatientData, BranchData, UserData, TreatmentDetailsData])
    ],
    controllers: [
        AppointmentController
    ],
    providers: [
        AppointmentService
    ]
})
export class AppointmentModule {}