import { PatientData } from "src/patient/models/data/PatientData";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('FileData')
export class FileData {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fileName: string;

    @Column()
    fileCode: string;

    @ManyToOne(type => PatientData, (patient) => patient.id)
    patient: PatientData;

    @Column()
    uploadedBy: number;

    @CreateDateColumn()
    created_at: Date;
}