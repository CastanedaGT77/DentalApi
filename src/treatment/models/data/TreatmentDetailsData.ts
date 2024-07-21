import { PatientData } from "src/patient/models/data/PatientData";
import { TreatmentTypeData } from "src/treatmentType/models/data/TreatmentTypeData";
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany, Column } from 'typeorm';
import { TreatmentData } from "./TreatmentData";
import { PaymentDetailData } from "src/payment/models/data/PaymentDetailData";

@Entity("TreatmentDetailsData")
export class TreatmentDetailsData {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => TreatmentData, (treatment) => treatment.id)
    treatment: TreatmentData

    @ManyToOne(type => TreatmentTypeData, (treatmentType) => treatmentType.id)
    treatmentType: TreatmentTypeData

    @Column()
    suggestedPrice: number;

    @Column()
    realPrice: number;

    /*
        False: Pending
        True: Finished
    */
   @Column()
    paymentStatus: boolean;

    @Column()
    piece: string;

    /*
        1 - pending
        2 - finished
    */
   @Column()
    status: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => PaymentDetailData, (payment) => payment.treatmentDetail)
    payments: PaymentDetailData[];
}