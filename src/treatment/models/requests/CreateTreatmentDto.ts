import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { MTreatmentType } from "./MTreatmentType";

export class CreateTreatmentDto {
    // Treatment
    @IsNotEmpty()
    @IsNumber()
    patientId: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsBoolean()
    quotation: boolean;

    @IsNotEmpty()
    @IsArray()
    // Treatment details
    treatmentTypes: MTreatmentType[]

    @IsString()
    description: string;
}