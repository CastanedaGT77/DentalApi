import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppointmentData } from "./models/data/AppointmentData";
import { AppointmentController } from "./appointment.controller";
import { AppointmentService } from "./appointment.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([AppointmentData])
    ],
    controllers: [
        AppointmentController
    ],
    providers: [
        AppointmentService
    ]
})
export class AppointmentModule {}