import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateTreatmentDetailDto {

    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsNumber()
    treatmentTypeId: number;

    @IsNotEmpty()
    @IsBoolean()
    quotation: boolean;

    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    piece: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;
}