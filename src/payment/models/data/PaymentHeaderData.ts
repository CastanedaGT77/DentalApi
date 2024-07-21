import { PatientData } from "src/patient/models/data/PatientData";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PaymentDetailData } from "./PaymentDetailData";

@Entity('PaymentHeaderData')
export class PaymentHeaderData {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PatientData, (patient) => patient.payments)
    patient: PatientData;

    @Column()
    name: string;

    @Column()
    address:string;

    @Column()
    phoneNumber: string;

    @OneToMany(() => PaymentDetailData, (detail) => detail.paymentHeader)
    paymentDetails: PaymentDetailData[];
}