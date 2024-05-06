import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class EditTreatmentTypeDto {
    @IsNotEmpty()
    @IsNumber()
    readonly id: number;

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @IsNotEmpty()
    @IsNumber()
    readonly suggestedPrice: number;

    @IsNotEmpty()
    @IsNumber()
    readonly estimatedTime: number;
}