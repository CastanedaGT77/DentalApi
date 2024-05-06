import { RoleData } from "src/roles/models/data/RoleData";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("UserData")
export class UserData {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    userName: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @ManyToOne(type => RoleData, (role) => role.id)
    rol: RoleData

    @Column({default: true})
    isActive: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}