import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CompanyData } from './CompanyData';

@Entity("PropertiesData")
export class PropertiesData {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    companyId: number;

    @Column({type: 'varchar', length: "10000"})
    logo: string;

    @Column()
    header: string;

    @Column()
    footer: string;

    @Column()
    primaryColor: string;

    @Column()
    secondaryColor: string;

    @Column()
    primaryButtonColor: string;

    @Column()
    secondaryButtonColor: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    allowMessageSending: boolean;
}