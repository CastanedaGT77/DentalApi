import { IsNotEmpty, IsNumber } from "class-validator";

export class DeleteTreatmentTypeDto {
    @IsNotEmpty()
    @IsNumber()
    readonly id: number;
}