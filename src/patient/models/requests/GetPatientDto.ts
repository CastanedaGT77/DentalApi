import { IsArray, IsDate, IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class GetPatientDto {
    @IsNotEmpty()
    @IsNumber()
    readonly id: number;
}