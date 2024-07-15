import { IsNumber, IsString } from "class-validator";

export class FinishAppointmentDto {
    
    @IsNumber()
    public appointmentId: number;
    
    @IsString()
    public observations: string;
}