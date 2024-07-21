import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { MTreatmentType } from "./MTreatmentType";

export class UpdateTreatmentDto {

    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsBoolean()
    quotation: boolean;

    @IsString()
    description: string;
}