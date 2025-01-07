import { IsArray, IsNumber, IsString } from 'class-validator';
import { MPaymentDetail } from '../type/MPaymentDetail';

export class CreatePaymentDto {
    // Header data
    @IsNumber()
    patientId: number;

    @IsString()
    name: string;

    @IsString()
    phoneNumber: string;

    @IsString()
    address: string;

    // Details data
    @IsArray()
    details: MPaymentDetail[];
}