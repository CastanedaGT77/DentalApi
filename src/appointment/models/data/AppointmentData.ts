import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AppointmentData {
    
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public patientId: number;
    
    @Column()
    public branchId: number;
    
    @Column()
    public assignedUser: number;
    
    @Column()
    public appointmentDate: Date;
    
    @Column()
    public observations: string;

    @Column({type: "tinyint"})
    public startHour: number;

    @Column({type: "tinyint"})
    public endHour: number;

    /* 
        0 - Pendiente
        1 - Finalizada
        2 - Cancelada
    */ 
    @Column({type: "tinyint"})
    public status: number;
}