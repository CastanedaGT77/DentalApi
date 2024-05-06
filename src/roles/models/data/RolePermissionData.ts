import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("RolePermissionData")
export class RolePermissionData {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    permissionId: number;

    @Column()
    roleId: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}