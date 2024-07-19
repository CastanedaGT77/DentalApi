import { PatientData } from "src/patient/models/data/PatientData";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("TreatmentData")
export class TreatmentData {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => PatientData, (patient) => patient.id)
    patient: PatientData

    @Column()
    name: string;

    @Column()
    description: string;

    /*
        1 - Activo
        2 - Finalizado
        3 - Cancelada
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
}