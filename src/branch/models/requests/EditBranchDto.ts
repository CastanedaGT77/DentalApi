import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class EditBranchDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;
}