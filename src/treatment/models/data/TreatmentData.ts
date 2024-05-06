import { PatientData } from "src/patient/models/data/PatientData";
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("TreatmentData")
export class TreatmentData {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => PatientData, (patient) => patient.id)
    patient: PatientData

    name: string;

    description: string;

    status: boolean;

    paymentStatus: boolean;

    quotation: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}