import { PatientData } from "src/patient/models/data/PatientData";
import { TreatmentTypeData } from "src/treatmentType/models/data/TreatmentTypeData";
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TreatmentData } from "./TreatmentData";

@Entity("TreatmentDetailsData")
export class TreatmentDetailsData {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => TreatmentData, (treatment) => treatment.id)
    treatment: TreatmentData

    @ManyToOne(type => TreatmentTypeData, (treatmentType) => treatmentType.id)
    treatmentType: TreatmentTypeData

    suggestedPrice: number;

    realPrice: number;

    paymentStatus: boolean;

    piece: string;

    status: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}