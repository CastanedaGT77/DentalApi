import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTreatmentTypeDto {
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