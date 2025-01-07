import { IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordDto {
    @IsNotEmpty()
    @IsString()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly username: string;
}