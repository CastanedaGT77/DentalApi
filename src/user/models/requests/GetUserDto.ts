import { IsNotEmpty } from "class-validator";

export class GetUserDto {
    @IsNotEmpty()
    readonly id: number;
}