import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IllnessDetailsData } from "../../../illnessDetail/models/data/IllnessDetailData";
import { AppointmentData } from "src/appointment/models/data/AppointmentData";
import { PaymentHeaderData } from "src/payment/models/data/PaymentHeaderData";
import { TreatmentData } from "src/treatment/models/data/TreatmentData";
import { FileData } from "src/files/models/data/FileData";
import { PatientData } from "src/patient/models/data/PatientData";
import { CompanyData } from "src/company/models/data/CompanyData";

@Entity("NewData")
export class NewData {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({type: "longtext"})
    image: string;

    @Column()
    available: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(company => CompanyData, (company) => company.id)
    company: CompanyData;
}