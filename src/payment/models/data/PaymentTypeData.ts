import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('PaymentTypeData')
export class PaymentTypeData {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}