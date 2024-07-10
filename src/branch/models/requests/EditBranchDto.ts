import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class EditBranchDto {

    @IsNotEmpty()
    @IsNumber()
    readonly id: number;

    @IsNotEmpty()
    @IsString()
    readonly name: string;
}