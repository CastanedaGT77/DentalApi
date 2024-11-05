import { BranchData } from 'src/branch/models/data/BranchData';
import { PatientData } from 'src/patient/models/data/PatientData';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class AppointmentData {
    
    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
    
    @Column()
    public assignedUser: number;
    
    @Column()
    public appointmentDate: Date;

    @Column()
    public startedAt: Date;

    @Column()
    public endedAt: Date;

    @Column({length: 10})
    public startHour: string;

    @Column({length: 10})
    public endHour: string;

    /* 
        0 - Pendiente
        1 - Finalizada
        2 - Cancelada
        3 - No asistió
    */ 
    @Column({type: "tinyint"})
    public status: number;

    @Column()
    public reason: string;

    @Column()
    public symptoms: string;

    @Column()
    public decription: string;

    @ManyToOne(() => PatientData, (patient) => patient.appointments)
    patientId: PatientData;

    @ManyToOne(() => BranchData, (branch) => branch.appointments)
    branchId: BranchData;
}