import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IllnessDetailsData } from "../../../illnessDetail/models/data/IllnessDetailData";
import { AppointmentData } from "src/appointment/models/data/AppointmentData";
import { PaymentHeaderData } from "src/payment/models/data/PaymentHeaderData";
import { TreatmentData } from "src/treatment/models/data/TreatmentData";
import { FileData } from "src/files/models/data/FileData";
import { PatientData } from "./PatientData";

@Entity("PatientTypeData")
export class PatientTypeData {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    prefix: string;

    @OneToMany(() => PatientData, (patient) => patient.type)
    patients: PatientData[];
}