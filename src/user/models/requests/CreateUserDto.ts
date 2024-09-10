import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    readonly firstName: string;

    @IsNotEmpty()
    @IsString()
    readonly lastName: string;

    @IsNotEmpty()
    readonly password: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsNumber()
    readonly role: number;

    @IsOptional()
    @IsBoolean()
    readonly allowBranchView: boolean;

    @IsOptional()
    @IsNumber()
    readonly branchId: number;
}