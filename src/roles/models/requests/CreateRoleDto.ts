import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateRoleDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsArray()
    readonly permissions: number[];
}