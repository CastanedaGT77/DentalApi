import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PaymentHeaderData } from "./PaymentHeaderData";
import { TreatmentDetailsData } from "src/treatment/models/data/TreatmentDetailsData";

@Entity('PaymentDetailData')
export class PaymentDetailData {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    amount: number;

    @ManyToOne(() => PaymentHeaderData, (paymentHeader) => paymentHeader.paymentDetails)
    paymentHeader: PaymentHeaderData;

    @ManyToOne(() => TreatmentDetailsData, (treatmentDetail) => treatmentDetail.payments)
    treatmentDetail: TreatmentDetailsData;
}