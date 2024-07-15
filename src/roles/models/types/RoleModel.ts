import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PermissionData } from "../data/PermissionData";

export class RoleModel {
    id: number;
    name: string;
    permissions?: PermissionData[]
};