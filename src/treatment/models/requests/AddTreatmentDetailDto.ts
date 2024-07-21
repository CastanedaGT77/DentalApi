import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AddTreatmentDetailDto {

    @IsNotEmpty()
    @IsNumber()
    treatmentId: number;

    @IsNotEmpty()
    @IsNumber()
    treatmentTypeId: number;

    @IsNotEmpty()
    @IsString()
    piece: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;
}