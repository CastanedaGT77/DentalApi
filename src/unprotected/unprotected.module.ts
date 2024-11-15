import { Module } from "@nestjs/common";
import { PublicAppointmentsController } from "./public-appointmenets/public-appointments.controller";

@Module({
    controllers: [
        PublicAppointmentsController
    ]
})
export class UnprotectedModule {}