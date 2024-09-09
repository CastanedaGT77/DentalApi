import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PatientData } from "src/patient/models/data/PatientData";
import { TreatmentData } from "src/treatment/models/data/TreatmentData";
import { TreatmentDetailsData } from "src/treatment/models/data/TreatmentDetailsData";
import { ReportController } from "./report.controller";
import { ReportService } from "./report.service";
import { PaymentHeaderData } from "src/payment/models/data/PaymentHeaderData";
import { PaymentDetailData } from "src/payment/models/data/PaymentDetailData";
import { PrinterService } from "./printer/printer.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([PatientData, TreatmentData, TreatmentDetailsData, PaymentHeaderData, PaymentDetailData])
    ],
    controllers: [
        ReportController
    ],
    providers: [
        ReportService,
        PrinterService
    ]
})
export class ReportModule {}