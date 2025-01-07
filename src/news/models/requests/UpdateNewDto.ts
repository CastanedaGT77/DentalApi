import { IsNotEmpty, IsNumber, IsString } from "class-validator"; 

export class UpdateNewDto {

    @IsNotEmpty()
    @IsNumber()
    readonly id: number;

    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @IsNotEmpty()
    @IsString()
    readonly image: string;
}