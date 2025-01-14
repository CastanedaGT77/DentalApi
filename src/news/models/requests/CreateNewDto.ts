import { IsNotEmpty, IsString } from "class-validator"; 

export class CreateNewDto {

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