import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class EditRoleDto {
    @IsNotEmpty()
    @IsNumber()
    readonly id: number;

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsArray()
    readonly permissions: number[];
}