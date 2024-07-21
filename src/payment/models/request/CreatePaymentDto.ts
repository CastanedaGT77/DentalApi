import { MPaymentDetail } from '../type/MPaymentDetail';

export class CreatePaymentDto {
    // Header data
    patientId: number;

    name: string;

    phoneNumber: string;

    address: string;

    // Details data
    details: MPaymentDetail[];
}