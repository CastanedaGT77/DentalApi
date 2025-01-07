import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IllnessDetailsData } from "../../../illnessDetail/models/data/IllnessDetailData";
import { AppointmentData } from "src/appointment/models/data/AppointmentData";
import { PaymentHeaderData } from "src/payment/models/data/PaymentHeaderData";
import { TreatmentData } from "src/treatment/models/data/TreatmentData";
import { FileData } from "src/files/models/data/FileData";
import { PatientTypeData } from "./PatientTypeData";
import { NewData } from "src/news/models/data/NewsData";

@Entity("PatientData")
export class PatientData {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    internalCode: string;

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

    // Usuario eliminado o no
    @Column()
    active: boolean;

    // Usuario aprobado
    @Column()
    approved: boolean;

    @Column({
        type: "text"
    })
    profileImage: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => PatientTypeData, (type) => type.patients)
    type: PatientTypeData;

    // Illness details
    @ManyToMany(() => IllnessDetailsData)
    @JoinTable({name: "patient_illness_details"})
    illnessDetails: IllnessDetailsData[];

    @OneToMany(() => TreatmentData, (treatment) => treatment.patient)
    treatments: TreatmentData[]

    @OneToMany(() => AppointmentData, (appointment) => appointment.patientId)
    appointments: AppointmentData[]

    @OneToMany(() => PaymentHeaderData, (payment) => payment.patient)
    payments: PaymentHeaderData[]

    @OneToMany(() => FileData, (file) => file.patient)
    files: FileData[]
}