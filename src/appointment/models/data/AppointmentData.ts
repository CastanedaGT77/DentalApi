import { PatientData } from 'src/patient/models/data/PatientData';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class AppointmentData {
    
    @PrimaryGeneratedColumn()
    public id: number;
    
    @Column()
    public branchId: number;
    
    @Column()
    public assignedUser: number;
    
    @Column()
    public appointmentDate: string;
    
    @Column()
    public observations: string;

    @Column({length: 10})
    public startHour: string;

    @Column({length: 10})
    public endHour: string;

    /* 
        0 - Pendiente
        1 - Finalizada
        2 - Cancelada
    */ 
    @Column({type: "tinyint"})
    public status: number;

    @ManyToOne(() => PatientData, (patient) => patient.appointments)
    patientId: PatientData;
}