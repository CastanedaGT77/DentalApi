import { IsNotEmpty, IsNumber } from "class-validator";

export class DeleteIllnessDetailDto {
    @IsNotEmpty()
    @IsNumber()
    readonly id: number;
}