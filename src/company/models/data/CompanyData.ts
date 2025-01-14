import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PropertiesData } from './PropertiesData';
import { NewData } from 'src/news/models/data/NewsData';

@Entity("CompanyData")
export class CompanyData {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    active: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;   
    
    @OneToOne(() => PropertiesData)
    @JoinColumn()
    properties: PropertiesData;

    @OneToMany(() => NewData, (news) => news.company)
    news: NewData[]
}