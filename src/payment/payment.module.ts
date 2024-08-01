import { Module } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PatientData } from "src/patient/models/data/PatientData";
import { TreatmentData } from "src/treatment/models/data/TreatmentData";
import { TreatmentDetailsData } from "src/treatment/models/data/TreatmentDetailsData";
import { PaymentController } from "./payment.controller";
import { PaymentHeaderData } from "./models/data/PaymentHeaderData";
import { PaymentDetailData } from "./models/data/PaymentDetailData";

@Module({
    imports: [
        TypeOrmModule.forFeature([PatientData, TreatmentData, TreatmentDetailsData, PaymentHeaderData, PaymentDetailData])
    ],
    controllers: [
        PaymentController
    ],
    providers: [
        PaymentService
    ]
})
export class PaymentModule {}