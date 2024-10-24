import { AppointmentData } from "src/appointment/models/data/AppointmentData";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("BranchData")
export class BranchData {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => AppointmentData, (appointment) => appointment.branchId)
    appointments: AppointmentData[]
}