import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IllnessDetailsData } from "../../../illnessDetail/models/data/IllnessDetailData";

@Entity("PatientData")
export class PatientData {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    phoneNumber: string;

    @Column()
    cellPhoneNumber: string;

    @Column()
    email: string;

    @Column()
    city: string;

    @Column()
    address: string;

    @Column()
    recommendedBy: string;

    @Column()
    personInCharge: string;

    @Column()
    birthDate: Date;

    @Column()
    maritalStatus: string;

    @Column()
    occupation: string;

    @Column()
    personalDoctor: string;

    @Column()
    previousDentist: string;

    @Column()
    active: boolean;

    @Column()
    approved: boolean;

    @Column()
    profileImage: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Illness details
    @ManyToMany(() => IllnessDetailsData)
    @JoinTable({name: "patient_illness_details"})
    illnessDetails: IllnessDetailsData[];
}