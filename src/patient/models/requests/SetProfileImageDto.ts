import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class SetProfileImageDto {
    @IsNotEmpty()
    @IsNumber()
    readonly id: number;

    @IsNotEmpty()
    @IsString()
    readonly image: string;
}