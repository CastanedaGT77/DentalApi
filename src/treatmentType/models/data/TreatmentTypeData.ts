import { PaymentDetailData } from "src/payment/models/data/PaymentDetailData";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("TreatmentTypeData")
export class TreatmentTypeData {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    suggestedPrice: number;

    @Column()
    estimatedTime: number;

    @Column()
    active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}