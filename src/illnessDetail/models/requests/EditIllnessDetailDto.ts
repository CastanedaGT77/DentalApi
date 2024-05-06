import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class EditIllnessDetailDto {
    @IsNotEmpty()
    @IsNumber()
    readonly id: number;

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;
}