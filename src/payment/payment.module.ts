import { Module } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PatientData } from "src/patient/models/data/PatientData";
import { TreatmentData } from "src/treatment/models/data/TreatmentData";
import { TreatmentDetailsData } from "src/treatment/models/data/TreatmentDetailsData";
import { PaymentController } from "./payment.controller";
import { PaymentHeaderData } from "./models/data/PaymentHeaderData";
import { PaymentDetailData } from "./models/data/PaymentDetailData";
import { ReportService } from "src/report/report.service";
import { PrinterService } from "src/report/printer/printer.service";
import { AppointmentData } from "src/appointment/models/data/AppointmentData";
import { CompanyData } from '../company/models/data/CompanyData';

@Module({
    imports: [
        TypeOrmModule.forFeature([CompanyData, PatientData, TreatmentData, TreatmentDetailsData, PaymentHeaderData, PaymentDetailData, AppointmentData])
    ],
    controllers: [
        PaymentController
    ],
    providers: [
        PaymentService,
        ReportService,
        PrinterService
    ]
})
export class PaymentModule {}