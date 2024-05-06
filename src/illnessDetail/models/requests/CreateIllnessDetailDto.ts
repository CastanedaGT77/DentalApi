import { IsNotEmpty, IsString } from "class-validator";

export class CreateIllnessDetailDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;
}