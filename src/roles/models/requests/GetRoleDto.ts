import { IsNotEmpty, IsNumber } from "class-validator";

export class GetRoleDto {
    @IsNotEmpty()
    @IsNumber()
    readonly id: number;
}