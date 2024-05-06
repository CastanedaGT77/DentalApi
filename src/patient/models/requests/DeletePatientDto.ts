import { IsArray, IsDate, IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class DeletePatientDto {
    @IsNotEmpty()
    @IsNumber()
    readonly id: number;
}