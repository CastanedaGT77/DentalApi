import { IsArray, IsDate, IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { IllnessDetailsData } from "src/illnessDetail/models/data/IllnessDetailData";

export class UpdatePatientDto {
    @IsNotEmpty()
    @IsNumber()
    readonly id: number;

    @IsNotEmpty()
    @IsString()
    readonly firstName: string;

    @IsNotEmpty()
    @IsString()
    readonly lastName: string;

    @IsNotEmpty()
    readonly phoneNumber: string;

    @IsNotEmpty()
    readonly cellPhoneNumber: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly city: string;

    @IsNotEmpty()
    @IsString()
    readonly address: string;

    @IsNotEmpty()
    @IsString()
    readonly recommendedBy: string;

    @IsNotEmpty()
    @IsString()
    readonly personInCharge: string;

    @IsNotEmpty()
    readonly birthDate: Date;

    @IsNotEmpty()
    @IsString()
    readonly maritalStatus: string;

    @IsNotEmpty()
    @IsString()
    readonly occupation: string;

    @IsNotEmpty()
    @IsString()
    readonly personalDoctor: string;

    @IsNotEmpty()
    @IsString()
    readonly previousDentist: string;

    // IllnessDetails
    @IsArray()
    illnessDetails: number[];
}