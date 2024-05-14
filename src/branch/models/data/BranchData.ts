import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
}