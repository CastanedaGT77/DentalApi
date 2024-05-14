import { IsNotEmpty, IsNumber } from "class-validator";

export class GetProfileImageDto {
    @IsNotEmpty()
    @IsNumber()
    readonly id: number;
}