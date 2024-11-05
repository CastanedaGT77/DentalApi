import { IsArray, IsNumber, IsString } from "class-validator";

export class FinishAppointmentDto {
    
    @IsNumber()
    public appointmentId: number;
    
    @IsString()
    public symptoms: string;

    @IsString()
    public description: string;

    @IsString()
    public applied: string;

    @IsArray()
    public treatmentDetails: {id: number}[]
}