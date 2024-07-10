import { IsNotEmpty, IsString } from "class-validator";

export class CreateBranchDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;
}