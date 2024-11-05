import { TreatmentDetailsData } from "src/treatment/models/data/TreatmentDetailsData";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AppointmentDetailsData {
    
    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(type => TreatmentDetailsData, (treatmentDetail) => treatmentDetail.appointment)
    treatmentDetail: TreatmentDetailsData

    @Column()
    public description: number;
}