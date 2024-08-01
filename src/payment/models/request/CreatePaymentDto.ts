import { IsArray, IsString } from 'class-validator';
import { MPaymentDetail } from '../type/MPaymentDetail';

export class CreatePaymentDto {
    // Header data
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