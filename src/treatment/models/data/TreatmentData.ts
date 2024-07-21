import { PatientData } from "src/patient/models/data/PatientData";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TreatmentDetailsData } from "./TreatmentDetailsData";

@Entity("TreatmentData")
export class TreatmentData {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PatientData, (patient) => patient.id)
    patient: PatientData

    @Column()
    name: string;

    @Column()
    description: string;

    /*
        false - Activo
        true - Finalizado
    */
    @Column()
    status: boolean;

    @Column()
    paymentStatus: boolean;

    @Column()
    quotation: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => TreatmentDetailsData, (detail) => detail.treatment)
    treatmentDetails: TreatmentDetailsData[];
}